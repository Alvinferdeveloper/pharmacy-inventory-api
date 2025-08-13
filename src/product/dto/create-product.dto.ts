import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsUrl, IsDefined } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;

  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: Date;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  idCategory: number;

  @IsNumber()
  @IsNotEmpty()
  idSupplier: number;
}
