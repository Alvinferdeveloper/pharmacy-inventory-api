import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsOptional()
  @IsString()
  @Matches(/^(|\d{3}-\d{6}-\d{4}[A-Z])$/, { message: 'La identificación debe tener el formato XXX-XXXXXX-XXXXX o estar vacío' })
  identification?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
