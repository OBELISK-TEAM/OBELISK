import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3002, {
  namespace: 'gateway',
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class SyncGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // authenticate client - check token
    // if not authenticated, then disconnect
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-board')
  handleJoinBoard(client: Socket, data: any) {
    console.log(`Client ${client.id} joined board: ${data.board}`);
    client.join(data.board);
    this.server.to(data.board).emit('user-joined', {
      user: client.id,
      board: data.board,
    });
  }

  // @SubscribeMessage('add-object')
  // addSlideObject(client: Socket, data: any) {
  //   console.log(`Client ${client.id} added object: ${data.object}`);
  //   console.log('Broadcasting to all clients except sender...\n');
  //   client.broadcast.emit('object-added', data);
  // }
  //
  // @SubscribeMessage('update-object')
  // updateSlideObject(client: Socket, data: any) {
  //   console.log(`Client ${client.id} updated object: ${data.object}`);
  //   console.log('Broadcasting to all clients except sender...\n');
  //   client.broadcast.emit('object-updated', data);
  // }
  //
  // @SubscribeMessage('delete-object')
  // deleteSlideObject(client: Socket, data: any) {
  //   console.log(`Client ${client.id}  deleted object: ${data.object}`);
  //   console.log('Broadcasting to all clients except sender...\n');
  //   client.broadcast.emit('object-deleted', data);
  // }
}
