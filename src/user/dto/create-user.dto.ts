import { IsString, IsNotEmpty, MaxLength, IsNumber, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^\d{3}-\d{6}-\d{4}[A-Z]$/, { message: 'La identificación debe tener el formato XXX-XXXXXX-XXXXX (ej. 888-200402-1000P)' })
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
