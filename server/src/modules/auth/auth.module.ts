import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { CacheModule } from '@nestjs/cache-manager';
import { WsAuthStrategy } from './strategies/ws.strategy';
import { WsAuthGuard } from './guards/ws.auth.guard';
import { BoardsModule } from '../boards/boards.module';

const DEFAULT_JWT_SECRET = 'secret';
const DEFAULT_JWT_EXPIRES_IN = '14d';

@Module({
  imports: [
    PassportModule,
    CacheModule.register(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', DEFAULT_JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRES_IN',
            DEFAULT_JWT_EXPIRES_IN,
          ),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BoardsModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    WsAuthGuard,
    WsAuthStrategy,
  ],
  controllers: [AuthController],
  exports: [WsAuthGuard, WsAuthStrategy],
})
export class AuthModule {}
