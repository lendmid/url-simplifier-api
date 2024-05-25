import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class URLDto {
  @ApiProperty({ default: 'http://localhost:3001/api' })
  @IsString()
  @IsNotEmpty()
  longUrl: string;
}
