import { IsInt, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsInt()
  idProduct!: number;

  @IsInt()
  quantity!: number;
}

export class CreateInvoiceDto {
  @IsInt()
  idCustomer!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductDto)
  products!: ProductDto[];
}
