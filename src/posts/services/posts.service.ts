import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, PipelineStage } from 'mongoose';
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
      let aggregate: PipelineStage[] = [
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $match: {
            deletedAt,
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            userName: { $arrayElemAt: ['$user.fullName', 0] },
            createdAt: 1,
          },
        },
      ];

      if (limit && offset) {
        aggregate = [
          ...aggregate,
          {
            $skip: offset,
          },
          {
            $limit: limit,
          },
        ];

        return await this.postModel.aggregate(aggregate).exec();
      }

      return this.postModel.aggregate(aggregate).exec();
    } catch (error) {
      throw new NotFoundException(`Cannot get posts ${error}`);
    }
  }

  async findOne(_id: string) {
    try {
      const post = await this.postModel.findById(_id).exec();

      if (!post) throw new NotFoundException(`Post ${_id} not found`);

      const result = await this.postModel
        .aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $match: {
              _id: post._id,
              deletedAt: null,
            },
          },
          {
            $project: {
              title: 1,
              content: 1,
              userName: { $arrayElemAt: ['$user.fullName', 0] },
              createdAt: 1,
            },
          },
          {
            $limit: 1,
          },
        ])
        .exec();

      if (!result || result.length === 0)
        throw new NotFoundException(`Post ${_id} not found`);

      return result[0];
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
