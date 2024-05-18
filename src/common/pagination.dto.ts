import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, default: 10 })
  take: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, default: 0 })
  skip: number;
}
