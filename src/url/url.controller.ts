import { Body, Controller, Get, Post, Res, Param, Query } from '@nestjs/common';
import { UrlService } from './url.service';
import { URLDto } from './dtos/url.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';

@ApiTags('Urls')
@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  @Post('urls')
  async getShortUrl(
    @Body()
    url: URLDto,
  ) {
    return this.service.getShortUrl(url);
  }

  @Get('urls')
  async getUrls(@Query() pagination: PaginationDto) {
    return this.service.getUrls(pagination);
  }

  @Get(':hash')
  async getLongUrl(
    @Res() res: Response,
    @Param('hash')
    hash: string,
  ) {
    const url = await this.service.getLongUrl(hash);
    return res.redirect(url.longUrl);
  }
}
