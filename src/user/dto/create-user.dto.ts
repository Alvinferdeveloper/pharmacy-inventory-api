import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  identification!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone!: string;

  @IsString()
  @MaxLength(100)
  email?: string;

  @IsNumber()
  @IsNotEmpty()
  roleId!: number;
}
