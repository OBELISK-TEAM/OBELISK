import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsAuthGuard } from '../../modules/auth/guards/ws.auth.guard';
import { Socket } from 'socket.io';
import {
  GwSocket,
  GwSocketWithTarget,
} from '../../shared/interfaces/auth/GwSocket';
import { JoinBoardService } from './join.board.service';

// unfortunately, filters cannot be applied to connection handlers
// so we have to use try-catch blocks to handle errors

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);
  constructor(
    private readonly wsAuthGuard: WsAuthGuard,
    private readonly joinBoardService: JoinBoardService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      await this.validateClient(client);
      this.logClientConnection(client);
      this.sendAuthMessage(client);
    } catch {
      this.emitErrorAndDisconnect(client, 'Connection failed to authenticate');
    }
  }

  async handleDisconnect(
    client: Socket | GwSocket | GwSocketWithTarget,
  ): Promise<void> {
    if (this.isClientOnBoardAndSlide(client)) {
      await this.joinBoardService.handleLeaveBoardAndSlide(client);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private async validateClient(client: Socket): Promise<void> {
    const context = this.createExecutionContext(client);
    await this.wsAuthGuard.canActivate(context);
  }

  private createExecutionContext(client: Socket): ExecutionContext {
    return {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as ExecutionContext;
  }

  private sendAuthMessage(client: Socket): void {
    client.emit('auth-success', { message: 'Connection established' });
  }

  private logClientConnection(client: GwSocket): void {
    this.logger.log(`Client connected: ${client.data.user.email} ${client.id}`);
  }

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }

  private isClientOnBoardAndSlide(
    client: Socket | GwSocket | GwSocketWithTarget,
  ): client is GwSocketWithTarget {
    return (
      client &&
      typeof client.data === 'object' &&
      'user' in client.data &&
      'targetBoard' in client.data.user && //eslint-disable-line
      'targetSlide' in client.data.user //eslint-disable-line
    );
  }
}
