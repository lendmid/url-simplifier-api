import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class URLDto {
  @ApiProperty({ default: 'http://localhost:3001/api' })
  @IsString()
  @IsNotEmpty()
  longUrl: string;
}

export class URLBatchDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 30 })
  id: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ default: 'www.facebook.com' })
  longUrl: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ default: '3-n.in/b' })
  shortUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'b' })
  hash: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 5 })
  visited: number;
}
