import { Injectable, Inject } from '@nestjs/common';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Invoice } from '../entities/Invoice.entity';
import { Product } from '../entities/Product.entity';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { REPOSITORIES } from '../constants';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(REPOSITORIES.INVOICE)
    private readonly invoiceRepository: Repository<Invoice>,
    @Inject(REPOSITORIES.PRODUCT)
    private readonly productRepository: Repository<Product>,
    @Inject(REPOSITORIES.INVOICE_DETAIL)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>,
  ) { }

  async getSalesOverTime(period: string): Promise<{ date: string; total: number }[]> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      default:
        startDate = startOfMonth(now); // Default to month
        break;
    }

    const sales = await this.invoiceRepository.find({
      where: {
        date: MoreThanOrEqual(startDate),
      },
      order: {
        date: 'ASC',
      },
    });

    const salesByDate = sales.reduce<Record<string, number>>((acc, invoice) => {
      const date = invoice.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += invoice.total;
      return acc;
    }, {});

    return Object.entries(salesByDate).map(([date, total]) => ({ date, total }));
  }

  async getBestSellingProducts(): Promise<any[]> {
    return this.invoiceDetailRepository
      .createQueryBuilder('invoiceDetail')
      .select('product.productName', 'productName')
      .addSelect('SUM(invoiceDetail.quantity)', 'totalQuantity')
      .innerJoin('invoiceDetail.product', 'product')
      .groupBy('product.idProduct')
      .orderBy('totalQuantity', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getDashboardStats(): Promise<any> {
    const today = new Date();
    const startOfToday = startOfDay(today);

    const totalSalesToday = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .where('invoice.date >= :startOfToday', { startOfToday })
      .getRawOne();

    const totalSalesThisMonth = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .where('invoice.date >= :startOfMonth', { startOfMonth: startOfMonth(today) })
      .getRawOne();

    const lowStockProducts = await this.productRepository.find({
      where: {
        stock: MoreThanOrEqual(0),
      },
      order: {
        stock: 'ASC',
      },
      take: 5,
    });

    const recentInvoices = await this.invoiceRepository.find({
      order: { date: 'DESC' },
      take: 5,
      relations: ['customer'],
    });

    return {
      totalSalesToday: totalSalesToday.total || 0,
      totalSalesThisMonth: totalSalesThisMonth.total || 0,
      lowStockProducts,
      recentInvoices,
    };
  }
}
