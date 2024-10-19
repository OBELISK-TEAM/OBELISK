import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from './decorators/users.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { SafeUserDoc } from '../../shared/interfaces/auth/SafeUserDoc';
import { CreateUserDto } from '../users/users.dto';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { Request, Response } from 'express';
import { AuthToken } from '../../shared/interfaces/auth/AuthToken';
import { MinimumRole, RequiredRole } from './decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user.role';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthToken> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@User() user: SafeUserDoc): AuthToken {
    return this.authService.login(user);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleRedirect(req, res);
  }

  @Post('google/login')
  async googleLogin(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  // add @UseGuards(JwtAuthGuard) to secure the route with JWT
  @Get('jwt-secured')
  @UseGuards(JwtAuthGuard)
  jwtSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }

  // add @MinimumRole(UserRole.SOMETHING) to secure the route with a minimum role
  @Get('min-role-secured-user')
  @UseGuards(JwtAuthGuard)
  @MinimumRole(UserRole.USER)
  minimumRoleSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }

  // add @RequiredRole(UserRole.SOMETHING) to secure the route with a required role
  @Get('req-role-secured-admin')
  @UseGuards(JwtAuthGuard)
  @RequiredRole(UserRole.ADMIN)
  requiredRoleSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }
}
