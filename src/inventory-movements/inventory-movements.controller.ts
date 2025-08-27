import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InventoryMovementsService } from './inventory-movements.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';

@Controller('inventory-movements')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
export class InventoryMovementsController {
  constructor(private readonly inventoryMovementsService: InventoryMovementsService) { }

  @Get()
  findAll(
    @Query('productCode') productCode?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.inventoryMovementsService.findAll(productCode, startDate, endDate);
  }
}
