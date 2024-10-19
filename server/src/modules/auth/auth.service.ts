import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../../mongo/schemas/user.schema';
import { SafeUserDoc } from '../../shared/interfaces/auth/SafeUserDoc';
import { CreateUserDto, UpdateUserDto } from '../users/users.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { GoogleUser } from '../../shared/interfaces/auth/GoogleUser';
import { AuthToken } from '../../shared/interfaces/auth/AuthToken';
import { UserAuthProvider } from 'src/enums/user.auth.provider';
import { UserResponseObject } from '../../shared/interfaces/response-objects/UserResponseObject';
import { Payload } from '../../shared/interfaces/auth/Payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<SafeUserDoc | null> {
    try {
      const user: UserDocument = await this.usersService.findUserByEmail(email);
      if (user && (await this.comparePasswords(password, user.password))) {
        return this.extractUserWithoutPassword(user);
      }
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return null;
  }

  async validateUserById(userId: string): Promise<SafeUserDoc | null> {
    try {
      const user: UserDocument = await this.usersService.findUserById(userId);
      if (user) return this.extractUserWithoutPassword(user);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return null;
  }

  private extractUserWithoutPassword(user: UserDocument): SafeUserDoc {
    const userObj: UserDocument = user.toObject();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword as SafeUserDoc;
  }

  private async comparePasswords(
    attempt: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(attempt, hashedPassword);
  }

  login(user: SafeUserDoc): AuthToken {
    return this.generateToken(user);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthToken> {
    let user: UserDocument | UserResponseObject;

    if (await this.usersService.emailExists(createUserDto.email)) {
      user = await this.handleRegisterWhenEmailExists(createUserDto);
    } else {
      user = await this.usersService.createUser(createUserDto);
    }

    return this.generateToken(user);
  }

  private async handleRegisterWhenEmailExists(
    createUserDto: CreateUserDto,
  ): Promise<UserDocument> {
    const user = await this.usersService.findUserByEmail(createUserDto.email);

    if (
      user.userAuthProvider == UserAuthProvider.INTERNAL ||
      user.userAuthProvider == UserAuthProvider.INTERNAL_AND_EXTERNAL
    ) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const updateUserDto = {
      email: createUserDto.email,
      password: createUserDto.password,
      userAuthProvider: UserAuthProvider.INTERNAL_AND_EXTERNAL,
    } as UpdateUserDto;

    return await this.usersService.updateUserById(
      user._id as string,
      updateUserDto,
    );
  }

  generateToken(
    user: UserDocument | SafeUserDoc | UserResponseObject,
  ): AuthToken {
    const payload = { email: user.email, _id: user._id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  // unfortunately passport-jwt does not support websockets
  // so we have to validate the token manually for ws.auth.guard.ts
  async validateToken(token: string): Promise<SafeUserDoc | null> {
    try {
      const payload = this.jwtService.verify<Payload>(token);
      return this.validateUserById(payload._id);
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async googleRedirect(req: Request, res: Response): Promise<void> {
    if (!req.query['state'])
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const userTempId = req.query['state'] as string;
    await this.cacheManager.set(
      `google_temp_id_${userTempId}`,
      req.user,
      10000,
    );
    res.send('<script>window.close()</script>');
  }

  async googleLogin(req: Request): Promise<AuthToken> {
    const auth = req.get('Authorization');
    if (!auth) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const userTempId = auth.split(' ')[1];
    if (!userTempId)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const googleUser = await this.cacheManager.get<GoogleUser>(
      `google_temp_id_${userTempId}`,
    );
    if (!googleUser)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.handleGoogleLogin(googleUser);
  }

  async handleGoogleLogin(googleUser: GoogleUser): Promise<AuthToken> {
    const email: string = googleUser.email;
    if (await this.usersService.emailExists(email)) {
      const user: UserDocument =
        await this.usersService.handleUserProvider(email);
      return this.generateToken(user);
    } else {
      const user: UserDocument =
        await this.usersService.createGoogleUser(email);
      return this.generateToken(user);
    }
  }
}
