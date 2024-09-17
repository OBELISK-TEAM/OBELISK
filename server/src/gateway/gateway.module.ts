import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { AuthModule } from '../modules/auth/auth.module';
import { BoardsModule } from '../modules/boards/boards.module';
import { WsAuthGuard } from '../modules/auth/guards/ws.auth.guard';
import { WsCustomStrategy } from '../modules/auth/strategies/ws.strategy';
// import { BoardsService } from '../modules/boards/boards.service';

@Module({
  imports: [AuthModule, BoardsModule],
  providers: [Gateway, WsAuthGuard, WsCustomStrategy],
})
export class GatewayModule {}
