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
import { UsersService } from './users.service';
import { UserResponseObject } from '../../shared/interfaces/response-objects/UserResponseObject';

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
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseObject> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<UserResponseObject> {
    return this.usersService.deleteUser(userId);
  }
}
