import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsAuthGuard } from '../modules/auth/guards/ws.auth.guard';
import { ExecutionContext, UseGuards } from '@nestjs/common';
import { SafeUserDoc } from '../shared/interfaces/auth/SafeUserDoc';
import { BoardsService } from '../modules/boards/boards.service';

const KEY = 'example-key-123';

@WebSocketGateway(3002, {
  namespace: 'gateway',
})
export class Gateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly wsAuthGuard: WsAuthGuard,
    private readonly boardsService: BoardsService,
  ) {}

  afterInit() {
    console.log('Gateway initialized on port 3002');
  }

  async handleConnection(client: Socket) {
    const context = {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as ExecutionContext;
    await this.wsAuthGuard.canActivate(context);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-board')
  @UseGuards(WsAuthGuard)
  async handleJoinBoard(client: Socket, data: JoinBoardDto) {
    const user: SafeUserDoc = client.data.user;
    // TODO verify if user has access to the board
    await this.getAvailableBoardsForUser(user);
    client.join(`${KEY}-${data.boardId}`);
    // client.emit(`someBoardId`, { boardId: '11111' });
  }

  // @SubscribeMessage('modify-slide')
  // handleModifySlide(client: Socket, data: any) {
  //   console.log('inside modify slide');
  //   console.log(data);
  //   console.log(client.data.user);
  //   console.log(data);
  //
  //   const { boardId, object } = data;
  //
  //   try {
  //     const user = client.data.user;
  //     console.log(user);
  //
  //     if (!user) {
  //       throw new WsException('Unauthorized user');
  //     }
  //
  //     // Sprawdzanie, czy użytkownik ma dostęp do modyfikacji slajdu
  //     const hasAccess = this.checkBoardAccess(user.id, boardId);
  //     if (!hasAccess) {
  //       throw new WsException('Access denied to board');
  //     }
  //
  //     // Wysyłanie wiadomości do klientów w tym samym pokoju, z wyłączeniem nadawcy
  //     client.to(boardId).emit('object-modified', { object });
  //   } catch (error) {
  //     client.emit('error', { message: error.message });
  //   }
  // }

  private async getAvailableBoardsForUser(user: SafeUserDoc) {
    console.log('inside getAvailableBoardsForUser');
    const userId = (user._id as string).toString();
    const boards = await this.boardsService.getAvailableBoardsForUser(userId);
    console.log(boards);
  }
}

export interface JoinBoardDto {
  boardId: string;
}
