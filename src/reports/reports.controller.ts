import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';
import express from 'express';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('sales-by-date')
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  async getSalesReportByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('export') exportType: string,
    @Res() res: express.Response,
  ) {
    const sales = await this.reportsService.getSalesReportByDateRange(
      startDate,
      endDate,
    );

    if (exportType === 'excel') {
      const buffer = await this.reportsService.generateSalesReportExcel(sales);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-de-ventas.xlsx');
      res.send(buffer);
    } else {
      res.send(sales);
    }
  }

  @Get('sales-by-customer')
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  async getSalesByCustomerReport(
    @Query('customerIdentification') customerIdentification: string,
    @Query('export') exportType: string,
    @Res() res: express.Response,
  ) {
    const sales = await this.reportsService.getSalesByCustomerReport(customerIdentification);
    if (exportType === 'excel') {
      const buffer = await this.reportsService.generateSalesByCustomerReportExcel(sales);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-cliente-${customerIdentification}.xlsx`);
      res.send(buffer);
    } else {
      res.send(sales);
    }
  }

  @Get('sales-by-product')
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  async getSalesByProductReport(
    @Query('productCode') productCode: string,
    @Query('export') exportType: string,
    @Res() res: express.Response,
  ) {
    const sales = await this.reportsService.getSalesByProductReport(productCode);

    if (exportType === 'excel') {
      const buffer = await this.reportsService.generateSalesByProductReportExcel(sales);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-producto-${productCode}.xlsx`);
      res.send(buffer);
    } else {
      res.send(sales);
    }
  }

  @Get('inventory')
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  async getInventoryReport(
    @Query('export') exportType: string,
    @Res() res: express.Response,
  ) {
    const products = await this.reportsService.getInventoryReport();

    if (exportType === 'excel') {
      const buffer = await this.reportsService.generateInventoryReportExcel(products);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-inventario.xlsx');
      res.send(buffer);
    } else {
      res.send(products);
    }
  }

  @Get('products-by-supplier')
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  async getProductsBySupplierReport(
    @Query('supplierName') supplierName: string,
    @Query('export') exportType: string,
    @Res() res: express.Response,
  ) {
    const products = await this.reportsService.getProductsBySupplierReport(supplierName);

    if (exportType === 'excel') {
      const buffer = await this.reportsService.generateProductsBySupplierReportExcel(products);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-productos-proveedor-${supplierName}.xlsx`);
      res.send(buffer);
    } else {
      res.send(products);
    }
  }

  @Get('users')
  @Roles(RoleName.ADMINISTRATOR)
  async getUsersReport(
    @Query('username') username: string,
    @Query('export') exportType: string,
    @Res() res: express.Response,
  ) {
    const users = await this.reportsService.getUsersReport(username);

    if (exportType === 'excel') {
      const buffer = await this.reportsService.generateUsersReportExcel(users);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-usuarios.xlsx');
      res.send(buffer);
    } else {
      res.send(users);
    }
  }
}
