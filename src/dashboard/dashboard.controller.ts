
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('sales-over-time')
  getSalesOverTime(@Query('period') period: string) {
    return this.dashboardService.getSalesOverTime(period);
  }

  @Get('best-selling-products')
  getBestSellingProducts() {
    return this.dashboardService.getBestSellingProducts();
  }

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('sales-by-category')
  getSalesByCategory() {
    return this.dashboardService.getSalesByCategory();
  }
}
