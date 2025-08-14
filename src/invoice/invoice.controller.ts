import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('purchase')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleName.ADMINISTRATOR, RoleName.SALESMAN)
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req) {
    return this.invoiceService.create(createInvoiceDto, req.user.idUser);
  }
}
