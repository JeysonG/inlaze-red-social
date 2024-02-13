import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types, now } from 'mongoose';

import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true, type: String })
  readonly title: string;

  @Prop({ required: true, type: String })
  readonly content: string;

  @Prop({ default: 0 })
  readonly likes: number;

  @Prop({ default: now() })
  readonly createdAt: Date;

  @Prop({ default: now() })
  readonly updatedAt: Date;

  @Prop({ default: null })
  readonly deletedAt: Date | null;

  @ApiProperty({ description: 'User associated' })
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  readonly userId: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
