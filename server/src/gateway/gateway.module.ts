import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { AuthModule } from '../modules/auth/auth.module';
import { BoardsModule } from '../modules/boards/boards.module';

@Module({
  imports: [AuthModule, BoardsModule],
  providers: [Gateway],
})
export class GatewayModule {}
