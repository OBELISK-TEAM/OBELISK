import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './users.dto';
import { User, UserDocument } from '../../../schemas/user.schema';
import { Board } from '../../../schemas/board.schema';
import { UserAuthProvider } from '../../../enums/user.auth.provider';

@Injectable()
export class UsersService {
  private readonly pageSize = 10;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(page: number = 1): Promise<UserDocument[]> {
    const skip = (page - 1) * this.pageSize;
    return this.userModel.find().skip(skip).limit(this.pageSize).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (await this.emailExists(createUserDto.email))
      throw new HttpException('User already exists', 400);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOneById(userId: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findById(userId).exec();
    if (!existingUser) throw new HttpException('User not found', 404);
    return existingUser;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (!existingUser) throw new HttpException('User not found', 404);
    return existingUser;
  }

  async emailExists(email: string): Promise<boolean> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    return !!existingUser;
  }

  async delete(userId: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (!existingUser) throw new HttpException('User not found', 404);
    return existingUser;
  }

  async addBoard(userId: string, board: Board): Promise<void> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { $push: { boards: board } }, { new: true })
      .exec();
    if (!updatedUser) throw new HttpException('User not found', 404);
  }

  async createGoogleUser(email: string): Promise<UserDocument> {
    const createdUser = new this.userModel({
      email,
      userAuthProvider: UserAuthProvider.GOOGLE,
    });
    return createdUser.save();
  }

  async updateUserProvider(email: string): Promise<UserDocument> {
    const existingUser = await this.findOneByEmail(email);
    existingUser.userAuthProvider = UserAuthProvider.GOOGLE;
    return existingUser.save();
  }
}
