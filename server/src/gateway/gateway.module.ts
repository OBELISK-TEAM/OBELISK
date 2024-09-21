import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { AuthModule } from '../modules/auth/auth.module';
import { BoardsModule } from '../modules/boards/boards.module';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';

@Module({
  imports: [AuthModule, BoardsModule],
  providers: [Gateway, ConnectionService, JoinBoardService],
})
export class GatewayModule {}
