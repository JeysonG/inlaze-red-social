import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, FilterUsersDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(params?: FilterUsersDto) {
    try {
      let aggregate: PipelineStage[] = [
        {
          $lookup: {
            from: 'posts',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', '$$userId'] },
                      { $eq: ['$deletedAt', null] },
                    ],
                  },
                },
              },
            ],
            as: 'posts',
          },
        },
        {
          $match: {
            deletedAt: null,
          },
        },
      ];
      const { limit, offset } = params;

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

        return await this.userModel.aggregate(aggregate);
      }

      return await this.userModel.aggregate(aggregate);
    } catch (error) {
      throw new NotFoundException(`Cannot get users ${error}`);
    }
  }

  async findOne(_id: string) {
    try {
      const user = await this.userModel.findById(_id).exec();

      if (!user) throw new NotFoundException(`User ${_id} not found`);

      const result = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'posts',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', '$$userId'] },
                      { $eq: ['$deletedAt', null] },
                    ],
                  },
                },
              },
            ],
            as: 'posts',
          },
        },
        {
          $match: {
            _id: user._id,
            deletedAt: null,
          },
        },
        {
          $project: {
            password: 0,
          },
        },
        {
          $limit: 1,
        },
      ]);

      if (result.length == 0)
        throw new NotFoundException(`User ${_id} not found`);

      return result[0];
    } catch (error) {
      throw new NotFoundException(`Cannot get user ${error}`);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (!user)
        throw new NotFoundException(`User with email ${email} not found`);
      return user;
    } catch (error) {
      throw new NotFoundException(`Don't exist user ${error}`);
    }
  }

  async create(payload: CreateUserDto) {
    try {
      const userModel = await new this.userModel(payload);
      const hashPassword = await bcrypt.hash(userModel.password, 10);
      userModel.password = hashPassword;

      const user = await userModel.save();
      const { password, ...userData } = user.toJSON();

      return userData;
    } catch (error) {
      throw new NotFoundException(`Cannot create user ${error}`);
    }
  }

  async markEmailAsVerified(email: string) {
    try {
      const user = await this.findByEmail(email);

      if (user.isEmailVerified)
        throw new NotFoundException('Email already verified');

      user.isEmailVerified = true;

      await user.save();

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw new NotFoundException(`Cannot create user ${error}`);
    }
  }

  async update(_id: string, payload: UpdateUserDto) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(_id, { $set: payload }, { new: true })
        .exec();

      if (!user) throw new NotFoundException(`User ${_id} not found`);
      return user;
    } catch (error) {
      throw new NotFoundException(`Cannot update user ${error}`);
    }
  }

  async softDelete(_id: string) {
    try {
      const now = new Date();

      const user = await this.userModel.findByIdAndUpdate(
        _id,
        { deletedAt: now },
        { new: true },
      );

      if (!user) throw new NotFoundException(`User ${_id} not found`);
      return user;
    } catch (error) {
      throw new NotFoundException(`Cannot remove user ${error}`);
    }
  }
}
