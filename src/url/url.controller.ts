import { Body, Controller, Get, Post, Res, Param } from '@nestjs/common';
import { UrlService } from './url.service';
import { URLDto } from './dtos/url.dto';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  @Post('urls')
  getShortUrl(
    @Body()
    url: URLDto,
  ) {
    return this.service.getShortUrl(url);
  }

  @Get('urls')
  getLast5Urls() {
    return this.service.getLast5Urls();
  }

  @Get(':hash')
  async redirect(
    @Res() res: Response,
    @Param('hash')
    hash: string,
  ) {
    const url = await this.service.redirect(hash);
    return res.redirect(url.longUrl);
  }
}
