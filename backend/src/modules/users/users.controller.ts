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

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query('page') page: number) {
    return this.usersService.findAll(page);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Delete(':id')
  async delete(@Param('id') userId: string) {
    return this.usersService.delete(userId);
  }
}
