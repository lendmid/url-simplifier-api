import { IsString, IsNotEmpty } from 'class-validator';

export class URLDto {
  @IsString()
  @IsNotEmpty()
  longUrl: string;
}
