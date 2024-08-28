import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { CreateUserDto } from '../users/users.dto';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { Request, Response } from 'express';
import { AuthToken } from '../../shared/interfaces/AuthToken';
import { MinimumRole, RequiredRole } from './decorators/roles.decorator';
import { UserRole } from '../../enums/user.role';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully registered and authenticated',
    type: AuthToken,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'user already registered',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found (unconsistent DB)',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthToken> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully authenticated - local',
    type: AuthToken,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized - local',
  })
  login(@User() user: SafeUserDoc): AuthToken {
    return this.authService.login(user);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully authenticated - google',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'email not provided',
  })
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleRedirect(req, res);
  }

  @Post('google/login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully authenticated - google',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized - google',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found (unconsistent DB)',
  })
  async googleLogin(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  // add @UseGuards(JwtAuthGuard) to secure the route with JWT
  @Get('jwt-secured')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully authenticated - jwt',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized - jwt',
  })
  jwtSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }

  // add @MinimumRole(UserRole.SOMETHING) to secure the route with a minimum role
  @Get('min-role-secured')
  @UseGuards(JwtAuthGuard)
  @MinimumRole(UserRole.USER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully authenticated - jwt and role',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized - jwt',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'minimum role not fulfilled',
  })
  minimumRoleSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }

  // add @RequiredRole(UserRole.SOMETHING) to secure the route with a required role
  @Get('req-role-secured')
  @UseGuards(JwtAuthGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully authenticated - jwt and role',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized - jwt',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'required role not fulfilled',
  })
  requiredRoleSecured(@User('_id') userId: string): string {
    return `You are authorized with id: ${userId}`;
  }
}
