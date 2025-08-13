import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('supplier')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @Post()
  @Roles(RoleName.ADMINISTRATOR)
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(+id);
  }

  @Put(':id')
  @Roles(RoleName.ADMINISTRATOR)
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMINISTRATOR)
  remove(@Param('id') id: string) {
    return this.supplierService.remove(+id);
  }
}
