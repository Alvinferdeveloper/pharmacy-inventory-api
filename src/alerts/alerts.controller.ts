import { Controller, Get, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';

@Controller('alerts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleName.ADMINISTRATOR, RoleName.SALESMAN, RoleName.CONSULTANT)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Get('low-stock')
  getLowStockProducts() {
    return this.alertsService.getLowStockProducts();
  }
}
