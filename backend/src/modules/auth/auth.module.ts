import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

const DEFAULT_JWT_SECRET = 'secret';
const DEFAULT_JWT_EXPIRES_IN = '14d';

@Module({
  imports: [
    PassportModule,
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
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const jwtSecret = this.configService.get<string>(
      'JWT_SECRET',
      DEFAULT_JWT_SECRET,
    );

    const jwtExpiresIn = this.configService.get<string>(
      'JWT_EXPIRES_IN',
      DEFAULT_JWT_EXPIRES_IN,
    );

    console.log(`JWT_SECRET: ${jwtSecret}`);
    console.log(`JWT_EXPIRES_IN: ${jwtExpiresIn}`);
  }
}
