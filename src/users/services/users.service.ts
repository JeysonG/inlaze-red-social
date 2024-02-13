import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, FilterUsersDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(params?: FilterUsersDto) {
    try {
      if (params) {
        const filters: FilterQuery<User> = {};
        const { limit, offset } = params;

        return await this.userModel
          .find(filters)
          .skip(offset)
          .limit(limit)
          .exec();
      }

      return await this.userModel.find().exec();
    } catch (error) {
      throw new NotFoundException(`Cannot get users ${error}`);
    }
  }

  async findOne(_id: string) {
    try {
      const model = await this.userModel.findById(_id);

      if (!model) throw new NotFoundException(`User ${_id} not found`);

      const { password, ...user } = model.toJSON();

      if (!user) throw new NotFoundException(`User ${_id} not found`);

      return user;
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

  async remove(_id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(_id);

      if (!user) throw new NotFoundException(`User ${_id} not found`);
      return user;
    } catch (error) {
      throw new NotFoundException(`Cannot remove user ${error}`);
    }
  }
}
