import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class BlacklistService {
  private redisClient;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  async add(token: string): Promise<void> {
    const result = await this.redisClient.set(token, 'revoked');
    return result;
  }

  async exist(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return !!result;
  }
}
