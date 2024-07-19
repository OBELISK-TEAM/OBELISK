import { HttpException, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { UserDocument } from '../../schemas/user.schema';
import { SafeUserDoc } from '../../shared/interfaces/SafeUserDoc';
import { Payload } from '../../shared/interfaces/Payload';
import { CreateUserDto } from './users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
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

  login(user: SafeUserDoc): string {
    return this.generateToken({ _id: user._id as string, email: user.email });
  }

  async register(createUserDto: CreateUserDto): Promise<string> {
    if (await this.usersService.emailExists(createUserDto.email))
      throw new HttpException('User already exists', 400);
    const newUser: UserDocument = await this.usersService.create(createUserDto);
    return this.generateToken({
      _id: newUser._id as string,
      email: newUser.email,
    });
  }

  generateToken(payload: Omit<Payload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload);
  }
}
