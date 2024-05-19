import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, default: 10 })
  readonly pageSize: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, default: 0 })
  readonly current: number;
}
