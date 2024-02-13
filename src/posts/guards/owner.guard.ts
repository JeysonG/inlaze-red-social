import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from '../services/posts.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private postService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const postId = request.params._id;
    const userId = request.body.userId;
    const post = await this.postService.findOne(postId);

    if (!post || post.userId != userId)
      throw new UnauthorizedException('Not allow');

    return true;
  }
}
