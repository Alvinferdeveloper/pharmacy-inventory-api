import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(\d{3}-\d{6}-\d{4}[A-Z]|$)/, { message: 'La identificación debe tener el formato XXX-XXXXXX-XXXXX o estar vacío' })
  identification?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
