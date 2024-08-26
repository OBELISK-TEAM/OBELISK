import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './users.dto';
import { UserResponseObject, UsersService } from './users.service';
import { UserDocument } from '../../schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('page') page: number): Promise<UserResponseObject[]> {
    return this.usersService.getUsers(page);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<UserResponseObject> {
    return this.usersService.getUserById(userId);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') userId: string): Promise<UserDocument> {
    return this.usersService.delete(userId);
  }
}
