import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username!: string;

  @IsNumber()
  @IsNotEmpty()
  roleId!: number;
}
