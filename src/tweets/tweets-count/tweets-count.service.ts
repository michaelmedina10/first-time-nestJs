import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { interval } from 'rxjs';
import { Tweet } from '../entities/tweet.entity';
import { Interval } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

@Injectable()
export class TweetsCountService {
  private limit = 10;
  constructor(
    @InjectModel(Tweet)
    private tweetModel: typeof Tweet,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  // Adicionando essa task para rodar em background (daemon) a cada 5s
  // Na doc NestJs task-scheduling
  @Interval(5000)
  async countTweets() {
    let offset = await this.cacheManager.get<number>('tweet-offset');
    offset = offset === undefined ? 0 : offset;
    const tweets = await this.tweetModel.findAll({
      offset,
      limit: this.limit,
    });
    console.log(`${tweets.length} tweets encontrados`);
    if (tweets.length === this.limit) {
      this.cacheManager.set('tweet-offset', offset + this.limit);
      console.log(`Achou mais ${this.limit} tweets`);
    }
  }
}
