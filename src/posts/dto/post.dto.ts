import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly userId: Types.ObjectId;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNumber()
  readonly likes: number;
}

export class FilterPostsDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;
}
