import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsAuthGuard } from '../../modules/auth/guards/ws.auth.guard';
import { Socket } from 'socket.io';
import { GwSocket } from '../../shared/interfaces/auth/GwSocket';

// unfortunately, filters cannot be applied to connection handlers
// so we have to use try-catch blocks to handle errors

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);
  constructor(private readonly wsAuthGuard: WsAuthGuard) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      await this.validateClient(client);
      this.logClientConnection(client);
      this.sendAuthMessage(client);
    } catch {
      this.emitErrorAndDisconnect(client, 'Connection failed to authenticate');
    }
  }

  handleDisconnect(client: Socket): void {
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
    client.emit('auth', { message: 'Connection established' });
  }

  private logClientConnection(client: GwSocket): void {
    this.logger.log(`Client connected: ${client.data.user.email} ${client.id}`);
  }

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }
}
