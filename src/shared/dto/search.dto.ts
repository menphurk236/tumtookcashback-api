import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {IsNumber} from "class-validator";

export class SearchDto {
  @ApiProperty({ default: 1, required: true })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number;

  @ApiProperty({ default: 10, required: true })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  perPage: number;

  @ApiProperty({ required: false })
  search?: string;
}
