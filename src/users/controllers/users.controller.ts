import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { CreateUserDto, FilterUsersDto, UpdateUserDto } from '../dto/user.dto';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(ApiKeyGuard)
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  get(@Query() params: FilterUsersDto) {
    return this.usersService.findAll(params);
  }

  @Get(':_id')
  getOne(@Param('_id') _id: string) {
    return this.usersService.findOne(_id);
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Put(':_id')
  update(@Param('_id') _id: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(_id, payload);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.usersService.softDelete(_id);
  }
}
