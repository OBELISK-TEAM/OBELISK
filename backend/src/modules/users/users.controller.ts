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
import { UserDocument } from '../../schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('page') page: number): Promise<UserDocument[]> {
    return this.usersService.findAll(page);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') userId: string): Promise<UserDocument> {
    return this.usersService.findOneById(userId);
  }

  @Delete(':id')
  async delete(@Param('id') userId: string): Promise<UserDocument> {
    return this.usersService.delete(userId);
  }
}
