import { IsOptional, IsString } from 'class-validator';
export class CreateTweetDto {
  @IsOptional()
  @IsString()
  name: string;
}
