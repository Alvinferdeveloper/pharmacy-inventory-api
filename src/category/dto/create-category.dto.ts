import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoryName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;
}
