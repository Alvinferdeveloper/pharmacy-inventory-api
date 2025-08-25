import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}-\d{6}-\d{4}[A-Z]$/, { message: 'La identificación debe tener el formato XXX-XXXXXX-XXXXX (ej. 888-200402-1000P)' })
  identification!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;
}
