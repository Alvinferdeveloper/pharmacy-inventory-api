import { IsInt, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsInt()
  productId!: number;

  @IsInt()
  quantity!: number;
}

export class CreateInvoiceDto {
  @IsInt()
  customerId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductDto)
  products!: ProductDto[];
}
