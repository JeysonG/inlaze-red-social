import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, now } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({ description: 'User name' })
  @Prop({ required: true, type: String })
  fullName: string;

  @Prop({ required: true, type: Number })
  age: number;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
