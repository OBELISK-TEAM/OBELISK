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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@User() user: SafeUserDoc): string {
    return this.authService.login(user);
  }

  @Get('secure')
  @UseGuards(JwtAuthGuard)
  status(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }

  // GOOGLE AUTHENTICATION

  // Google OAuth callback
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleRedirect(req, res);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }
}
