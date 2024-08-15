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
import { SafeUserDoc } from '../../shared/interfaces/SafeUserDoc';
import { CreateUserDto } from './users/users.dto';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { Request, Response } from 'express';
import { AuthToken } from '../../shared/interfaces/AuthToken';
import { Role } from './decorators/roles.decorator';
import { UserRole } from '../../enums/user.role';

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

  @Get('jwt-secured')
  @UseGuards(JwtAuthGuard)
  jwtSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }

  @Get('jwt-and-role-secured')
  @UseGuards(JwtAuthGuard)
  @Role(UserRole.ADMIN)
  @Role(UserRole.USER)
  jwtAndRoleSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
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
}
