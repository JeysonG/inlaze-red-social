import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigType } from '@nestjs/config';

import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/user.entity';
import { PayloadToken } from '../models/token.model';
import config from 'src/config';
import { CreateUserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(payload: CreateUserDto) {
    try {
      const newUser = await this.userService.create(payload);

      if (!newUser) throw new NotFoundException(`Cannot sign up User`);

      /** TODO
       * Send verify email confirmation
       */

      return {
        success: true,
        message: 'User registered successfully',
      };
    } catch (error) {
      throw new NotFoundException(`Cannot sign up User ${error}`);
    }
  }

  async signIn(user: User) {
    const userWithToken = await this.generateJWT(user);

    return userWithToken;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const { password, ...result } = user.toJSON();
        return result;
      }
    }
    return null;
  }

  async generateJWT(user: User) {
    const { _id, email } = user;
    const payload: PayloadToken = { sub: _id, email };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async logout() {
    /* Logout user */
  }
}
