import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { FilterUsersDto } from 'src/users/dto/user.dto';
import { Post } from '../entities/post.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto) {
    try {
      createPostDto.userId = new ObjectId(createPostDto.userId);
      const postModel = await new this.postModel(createPostDto);
      const post = await postModel.save();
      return post;
    } catch (error) {
      throw new NotFoundException(`Cannot create user ${error}`);
    }
  }

  async findAll(params?: FilterUsersDto) {
    try {
      const { limit, offset } = params;
      const deletedAt = null;

      if (limit && offset)
        return await this.postModel
          .find({ deletedAt })
          .skip(offset)
          .limit(limit)
          .exec();

      return await this.postModel.find({ deletedAt }).exec();
    } catch (error) {
      throw new NotFoundException(`Cannot get posts ${error}`);
    }
  }

  async findOne(_id: string) {
    try {
      const post = await this.postModel.find({ _id, deletedAt: null }).exec();

      if (!post || post.length === 0)
        throw new NotFoundException(`Post ${_id} not found`);

      return post[0];
    } catch (error) {
      throw new NotFoundException(`Cannot get post ${error}`);
    }
  }

  async update(_id: string, updatePostDto: UpdatePostDto) {
    try {
      updatePostDto.userId = new ObjectId(updatePostDto.userId);
      const post = await this.postModel
        .findByIdAndUpdate(_id, { $set: updatePostDto }, { new: true })
        .exec();

      if (!post) throw new NotFoundException(`Post ${_id} not found`);
      return post;
    } catch (error) {
      throw new NotFoundException(`Cannot update post ${error}`);
    }
  }

  async softDelete(_id: string) {
    try {
      const now = new Date();

      const post = await this.postModel.findByIdAndUpdate(
        _id,
        { deletedAt: now },
        { new: true },
      );

      if (!post) throw new NotFoundException(`Post ${_id} not found`);
      return post;
    } catch (error) {
      throw new NotFoundException(`Cannot remove post ${error}`);
    }
  }
}
