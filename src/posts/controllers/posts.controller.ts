import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostsService } from '../services/posts.service';
import { CreatePostDto, FilterPostsDto, UpdatePostDto } from '../dto/post.dto';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(ApiKeyGuard)
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  get(@Query() params: FilterPostsDto) {
    return this.postsService.findAll(params);
  }

  @Get(':_id')
  getOne(@Param('_id') _id: string) {
    return this.postsService.findOne(_id);
  }

  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(_id, updatePostDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.postsService.remove(_id);
  }
}
