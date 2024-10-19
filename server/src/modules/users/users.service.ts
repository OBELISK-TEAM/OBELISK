import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User, UserDocument } from '../../mongo/schemas/user.schema';
import { UserAuthProvider } from '../../shared/enums/user.auth.provider';
import { UserResponseObject } from '../../shared/interfaces/response-objects/UserResponseObject';

@Injectable()
export class UsersService {
  private readonly pageSize = 10;
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseObject> {
    if (await this.emailExists(createUserDto.email))
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    return this.createNewUser(createUserDto).then(user =>
      this.toResponseUser(user),
    );
  }

  async findUserById(userId: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findById(userId).exec();
    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return existingUser;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return existingUser;
  }

  async createNewUser(user: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  async updateUserById(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  async emailExists(email: string): Promise<boolean> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    return !!existingUser;
  }

  async deleteBoardFromUser(userId: string, boardId: string): Promise<void> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { $pull: { boards: boardId } }, { new: true })
      .exec();
    if (!updatedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async createGoogleUser(email: string): Promise<UserDocument> {
    return this.userModel.create({
      email,
      userAuthProvider: UserAuthProvider.GOOGLE,
    });
  }

  async handleUserProvider(email: string): Promise<UserDocument> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser.userAuthProvider === UserAuthProvider.INTERNAL) {
      existingUser.userAuthProvider = UserAuthProvider.INTERNAL_AND_EXTERNAL;
      await existingUser.save();
    }
    return existingUser;
  }

  public toResponseUser(
    user: UserDocument,
    showTimestamps: boolean = false,
  ): UserResponseObject {
    const { _id, email, userRole, userAuthProvider } =
      user.toObject() as UserDocument;
    const responseObject: UserResponseObject = {
      _id: _id as string,
      email,
      userRole,
      userAuthProvider,
    };

    if (showTimestamps) {
      responseObject.createdAt = user.createdAt;
      responseObject.updatedAt = user.updatedAt;
    }
    return responseObject;
  }
}
