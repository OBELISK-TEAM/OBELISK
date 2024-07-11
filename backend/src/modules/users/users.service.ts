import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './users.dto';
import { User } from '../../schemas/user.schema';
import { Board } from '../../schemas/board.schema';

@Injectable()
export class UsersService {
  private readonly pageSize = 10;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(page: number = 1): Promise<User[]> {
    const skip = (page - 1) * this.pageSize;
    return this.userModel.find().skip(skip).limit(this.pageSize).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(userId: string): Promise<User> {
    const existingUser = await this.userModel.findById(userId).exec();
    if (!existingUser) throw new HttpException('User not found', 404);
    return existingUser;
  }

  async delete(userId: string): Promise<User> {
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
}
