import { IsString } from 'class-validator';

export class GetAllSortDto {
  @IsString()
  pagination: string;

  @IsString()
  sort: string;

  @IsString()
  filter: string;
}
