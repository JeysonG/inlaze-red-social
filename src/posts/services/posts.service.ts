import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { FilterUsersDto } from 'src/users/dto/user.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const postModel = await new this.postModel(createPostDto);
      const post = await postModel.save();
      return post;
    } catch (error) {
      throw new NotFoundException(`Cannot create user ${error}`);
    }
  }

  async findAll(params?: FilterUsersDto) {
    try {
      if (params) {
        const filters: FilterQuery<Post> = {};
        const { limit, offset } = params;

        return await this.postModel
          .find(filters)
          .skip(offset)
          .limit(limit)
          .exec();
      }

      return await this.postModel.find().exec();
    } catch (error) {
      throw new NotFoundException(`Cannot get posts ${error}`);
    }
  }

  async findOne(_id: string) {
    try {
      const model = await this.postModel.findById(_id);

      if (!model) throw new NotFoundException(`Post ${_id} not found`);
      const post = model.toJSON();

      return post;
    } catch (error) {
      throw new NotFoundException(`Cannot get post ${error}`);
    }
  }

  async update(_id: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postModel
        .findByIdAndUpdate(_id, { $set: updatePostDto }, { new: true })
        .exec();

      if (!post) throw new NotFoundException(`Post ${_id} not found`);
      return post;
    } catch (error) {
      throw new NotFoundException(`Cannot update post ${error}`);
    }
  }

  async remove(_id: string) {
    try {
      const post = await this.postModel.findByIdAndDelete(_id);

      if (!post) throw new NotFoundException(`Post ${_id} not found`);
      return post;
    } catch (error) {
      throw new NotFoundException(`Cannot remove post ${error}`);
    }
  }
}
