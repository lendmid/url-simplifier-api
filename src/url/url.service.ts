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

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private repo: Repository<Url>,
  ) {}

  async getShortUrl(url: URLDto) {
    const { longUrl } = url;

    if (!isUrl(longUrl)) {
      throw new BadRequestException('Should be provided a valid URL');
    }

    const hash = (Math.random() + 1).toString(36).substring(2);

    try {
      let url = await this.repo.findOneBy({ longUrl });
      if (url) return url.shortUrl;

      const shortUrl = `${process.env.BASE_URL}/${hash}`;

      url = this.repo.create({ hash, longUrl, shortUrl });
      this.repo.save(url);

      return url.shortUrl;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async getLast5Urls() {
    try {
      const urls = await this.repo.find({
        take: 5,
        order: { id: 'DESC' },
      });
      return urls || [];
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Urls Not Found');
    }
  }

  async redirect(hash: string) {
    try {
      const url = await this.repo.findOneBy({ hash });
      if (url) return url;
      throw new NotFoundException('Resource Not Found');
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Resource Not Found');
    }
  }
}
