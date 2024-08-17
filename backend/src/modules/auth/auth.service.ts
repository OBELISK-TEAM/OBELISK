import { HttpException, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../../schemas/user.schema';
import { SafeUserDoc } from '../../shared/interfaces/SafeUserDoc';
import { CreateUserDto } from '../users/users.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { GoogleUser } from '../../shared/interfaces/GoogleUser';
import { AuthToken } from '../../shared/interfaces/AuthToken';

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
      const user: UserDocument = await this.usersService.findOneByEmail(email);
      if (user && (await this.comparePasswords(password, user.password))) {
        return this.extractUserWithoutPassword(user);
      }
    } catch (error) {
      throw new HttpException('Invalid credentials', 401);
    }
    return null;
  }

  async validateUserById(userId: string): Promise<SafeUserDoc | null> {
    try {
      const user: UserDocument = await this.usersService.findOneById(userId);
      if (user) return this.extractUserWithoutPassword(user);
    } catch (error) {
      throw new HttpException('Invalid token', 401);
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
    if (await this.usersService.emailExists(createUserDto.email))
      throw new HttpException('User already exists', 400);
    const newUser: UserDocument = await this.usersService.create(createUserDto);
    return this.generateToken(newUser);
  }

  generateToken(user: UserDocument | SafeUserDoc): AuthToken {
    const payload = { email: user.email, _id: user._id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async googleRedirect(req: Request, res: Response): Promise<void> {
    if (!req.query['state']) throw new HttpException('Unauthorized', 401);
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
    if (!auth) throw new HttpException('Unauthorized', 401);
    const userTempId = auth.split(' ')[1];
    if (!userTempId) throw new HttpException('Unauthorized', 401);
    const googleUser = await this.cacheManager.get<GoogleUser>(
      `google_temp_id_${userTempId}`,
    );
    if (!googleUser) throw new HttpException('Unauthorized', 401);
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
