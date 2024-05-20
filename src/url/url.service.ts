import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { URLDto } from './dtos/url.dto';
import isUrl from 'is-url';
import base62 from 'base62/lib/ascii';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private repo: Repository<Url>,
  ) {}

  async shortUrl(url: URLDto, host: string) {
    const { longUrl } = url;

    if (!isUrl(longUrl)) {
      throw new BadRequestException('Should be provided a valid URL');
    }

    try {
      let url = await this.repo.findOneBy({ longUrl });
      if (url) return url;

      const total = await this.repo.count({});
      const hash = base62.encode(total);
      const shortUrl = `${host}/${hash}`;

      url = await this.repo.save({ hash, longUrl, shortUrl, visited: 0 });
      return url;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Server Error', error);
    }
  }

  async getUrls({ pageSize = 5, current = 1 }) {
    try {
      const [urls, total] = await this.repo.findAndCount({
        take: pageSize,
        skip: current - 1,
        order: { id: 'DESC' },
      });
      return { urls, pagination: { total, pageSize, current } };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Urls Not Found', error);
    }
  }

  async getLongUrl(hash: string) {
    try {
      const url = await this.repo.findOneBy({ hash });
      if (url) {
        url.visited = url.visited ? (url.visited += 1) : 1;
        await this.repo.save(url);
        return url;
      }
      throw new NotFoundException('Url Not Found in Data Base');
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Url Not Found in Data Base', error);
    }
  }
}
