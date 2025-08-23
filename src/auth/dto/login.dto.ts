import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identification!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
