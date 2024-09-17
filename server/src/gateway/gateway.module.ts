import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [Gateway],
})
export class GatewayModule {}
