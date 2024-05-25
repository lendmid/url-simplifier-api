import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Param,
  Query,
  Headers,
  Patch,
  Delete,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { URLDto } from './dtos/url.dto';
import { Response } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';

@ApiTags('Urls')
@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  @Post('urls')
  @ApiHeader({ name: 'origin', schema: { default: 'http://localhost:3000' } })
  async shortUrl(@Body() url: URLDto, @Headers('origin') origin: string) {
    return this.service.shortUrl(url, origin);
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

  @Patch('urls/:id')
  async uppdateLongUrl(@Param('id') id: number, @Body() body: URLDto) {
    return this.service.uppdateLongUrl(id, body.longUrl);
  }

  @Delete('urls/:id')
  async deleteUrl(@Param('id') id: number) {
    return this.service.deleteUrl(id);
  }
}
