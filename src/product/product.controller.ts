import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Roles(RoleName.ADMINISTRATOR)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Roles(RoleName.ADMINISTRATOR, RoleName.SALESMAN, RoleName.CONSULTANT)
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @Roles(RoleName.ADMINISTRATOR, RoleName.SALESMAN, RoleName.CONSULTANT)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @Roles(RoleName.ADMINISTRATOR)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMINISTRATOR)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
