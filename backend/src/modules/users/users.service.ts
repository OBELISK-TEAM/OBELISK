import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User, UserDocument } from '../../schemas/user.schema';
import { BoardDocument } from '../../schemas/board.schema';
import { UserAuthProvider } from '../../enums/user.auth.provider';
import { SlideObject } from 'src/schemas/slide-object.schema';

@Injectable()
export class UsersService {
  private readonly pageSize = 10;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(page: number = 1): Promise<UserResponseObject[]> {
    const skip = (page - 1) * this.pageSize;
    return await this.userModel
      .find()
      .skip(skip)
      .limit(this.pageSize)
      .exec()
      .then(users => Promise.all(users.map(user => this.toResponseUser(user))));
  }

  async getUserById(userId: string): Promise<UserResponseObject> {
    return this.findOneById(userId).then(user => this.toResponseUser(user));
  }

  async findOneById(userId: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findById(userId).exec();
    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return existingUser;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (await this.emailExists(createUserDto.email))
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    const createdUser = new this.userModel(createUserDto);
    return createdUser;
    // return createdUser.save().then(user => this.toResponseUser(user));
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return existingUser;
  }

  async update(
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

  async delete(userId: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (!deletedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return deletedUser;
  }

  async addBoardToUser(userId: string, board: BoardDocument): Promise<void> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { $push: { boards: board } }, { new: true })
      .exec();
    if (!updatedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async addSlideObjectToUser(
    userId: string,
    slideObject: SlideObject,
  ): Promise<void> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { slideObjects: slideObject } },
        { new: true },
      )
      .exec();
    if (!updatedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async createGoogleUser(email: string): Promise<UserDocument> {
    const createdUser = new this.userModel({
      email,
      userAuthProvider: UserAuthProvider.GOOGLE,
    });
    return createdUser.save();
  }

  async handleUserProvider(email: string): Promise<UserDocument> {
    const existingUser = await this.findOneByEmail(email);
    if (existingUser.userAuthProvider === UserAuthProvider.INTERNAL) {
      existingUser.userAuthProvider = UserAuthProvider.INTERNAL_AND_EXTERNAL;
      await existingUser.save();
    }
    return existingUser;
  }

  async toResponseUser(
    user: UserDocument,
    showBoards: boolean = false,
    showSlideObjects: boolean = false,
    showTimestamps: boolean = false, // we can separate into last active and created/updated at
  ) {
    const { _id, email, userRole, userAuthProvider } = user;
    const responseObject: any = {
      _id,
      email,
      userRole,
      userAuthProvider,
    };
    if (showBoards) responseObject.boards = user.boards;
    if (showSlideObjects) responseObject.slideObjects = user.slideObjects;
    if (showTimestamps) {
      responseObject.lastActive = user.lastActive;
      responseObject.createdAt = user.createdAt;
      responseObject.updatedAt = user.updatedAt;
    }
    return responseObject;
  }
}

export interface UserResponseObject {
  _id: string;
  email: string;
  userRole: number;
  userAuthProvider: number;
  boards?: string[];
  slideObjects?: string[];
}
