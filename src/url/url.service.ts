import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { URLBatchDto, URLDto } from './dtos/url.dto';
import isUrl from 'is-url';
import base62 from 'base62/lib/ascii';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private repo: Repository<Url>,
  ) {}

  async shortUrl(url: URLDto, origin: string) {
    let { longUrl } = url;

    if (!longUrl.includes('http://') && !longUrl.includes('https://')) {
      longUrl = 'http://' + longUrl;
    }
    if (!isUrl(longUrl)) {
      throw new BadRequestException('Should be provided a valid URL');
    }

    try {
      let url = await this.repo.findOneBy({ longUrl });
      if (url) return url;

      const total = await this.repo.count({});
      const hash = base62.encode(total);
      const shortUrl = `${new URL(origin).host}/${hash}`;

      url = await this.repo.save({ hash, longUrl, shortUrl, visited: 0 });
      return url;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Could not save the URL', error);
    }
  }

  async getUrls({ pageSize = 5, pageNumber = 0 }) {
    try {
      const [urls, total] = await this.repo.findAndCount({
        take: pageSize,
        skip: pageNumber * pageSize,
        order: { id: 'DESC' },
      });
      return { urls, pagination: { total, pageSize, pageNumber } };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Urls not found in Data Base', error);
    }
  }

  async getLongUrl(hash: string) {
    try {
      const url = await this.repo.findOneByOrFail({ hash });
      url.visited = url.visited ? (url.visited += 1) : 1;
      await this.repo.save(url);
      return url;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Urls not found in Data Base', error);
    }
  }

  async uppdateLongUrl(id: number, longUrl: string) {
    if (!isUrl(longUrl)) {
      throw new BadRequestException('Should be provided a valid URL');
    }
    try {
      const url = await this.repo.findOneByOrFail({ id });
      url.longUrl = longUrl;
      await this.repo.save(url);
      return url;
    } catch (error) {
      throw new NotFoundException('Could not update the URL', error);
    }
  }

  async deleteUrl(id: number) {
    try {
      return await this.repo.delete([id]);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Could not delete the URL', error);
    }
  }

  async batchUrls(urls: URLBatchDto[]) {
    urls.forEach((url) => {
      if (
        !url.longUrl.includes('http://') &&
        !url.longUrl.includes('https://')
      ) {
        url.longUrl = 'http://' + url.longUrl;
      }
      if (!isUrl(url.longUrl) || !isUrl('http://' + url.shortUrl)) {
        throw new BadRequestException('Should be provided a valid URLs');
      }
    });
    try {
      return await this.repo
        .createQueryBuilder()
        .insert()
        .into(Url)
        .values(urls)
        .execute();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Could not insert the URLs', error);
    }
  }
}
