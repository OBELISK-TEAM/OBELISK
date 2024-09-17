import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsAuthGuard } from '../modules/auth/guards/ws.auth.guard';
import { ExecutionContext, UseGuards } from '@nestjs/common';

@WebSocketGateway(3002, {
  namespace: 'gateway',
})
export class Gateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly wsAuthGuard: WsAuthGuard) {}

  afterInit() {
    console.log('Gateway initialized on port 3002');
  }

  async handleConnection(client: Socket) {
    console.log('inside handle connection');

    const context = {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as ExecutionContext;

    try {
      const canConnect = await this.wsAuthGuard.canActivate(context);

      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new WsException('Token not provided');
      }

      console.log(token);

      const user = 'user123123123';
      // passport method for extracting bearer token
      // auth service method for validating user by id
      // sth like this:
      // const safeUser = await this.authService.validateUserById(payload._id);
      console.log(user);
      // if (!user) {
      //   throw new WsException('Invalid token');
      // }

      // store user data in client
      client.data.user = user;

      console.log(`Client connected: ${client.id}`);
    } catch (error) {
      console.error('Authentication error', error.message);
      client.emit('error', {
        message: 'Authentication error: ' + error.message,
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-board')
  @UseGuards(WsAuthGuard)
  async handleJoinBoard(client: Socket, data: any) {
    console.log(data);

    const { boardId } = data;

    try {
      // this.boardsService.verifyBoardPermission();

      // Weryfikacja czy użytkownik ma dostęp do boardu
      const user = client.data.user;

      console.log('inside join board');
      console.log(user);

      if (!user) {
        throw new WsException('Unauthorized user');
      }

      // Logika do sprawdzenia dostępu użytkownika do boardu
      const hasAccess = await this.checkBoardAccess(user.id, boardId);
      if (!hasAccess) {
        throw new WsException('Access denied to board');
      }

      console.log(`Client ${client.id} joined board ${boardId}`);
      client.join(boardId); // Dołączenie do pokoju
      client.emit('joined-board', { boardId });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('modify-slide')
  handleModifySlide(client: Socket, data: any) {
    console.log('inside modify slide');
    console.log(data);
    console.log(client.data.user);
    console.log(data);

    const { boardId, object } = data;

    try {
      const user = client.data.user;
      console.log(user);

      if (!user) {
        throw new WsException('Unauthorized user');
      }

      // Sprawdzanie, czy użytkownik ma dostęp do modyfikacji slajdu
      const hasAccess = this.checkBoardAccess(user.id, boardId);
      if (!hasAccess) {
        throw new WsException('Access denied to board');
      }

      // Wysyłanie wiadomości do klientów w tym samym pokoju, z wyłączeniem nadawcy
      client.to(boardId).emit('object-modified', { object });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  private async checkBoardAccess(
    userId: string,
    boardId: string,
  ): Promise<boolean> {
    // Logika sprawdzania, czy użytkownik ma dostęp do danego boardu
    // Tutaj możesz sprawdzić, czy użytkownik ma dostęp do boardu
    return true; // Domyślnie zwracamy true (przykład)
  }
}
