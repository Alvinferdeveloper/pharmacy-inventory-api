import { Injectable, Inject } from '@nestjs/common';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
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
      acc[date] += Number(invoice.total);
      return acc;
    }, {});

    return Object.entries(salesByDate).map(([date, total]) => ({ date, total }));
  }

  async getBestSellingProducts(): Promise<any[]> {
    return this.invoiceDetailRepository
      .createQueryBuilder('invoiceDetail')
      .select('product.id_product', 'idProduct')
      .addSelect('product.productName', 'productName')
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
        stock: LessThanOrEqual(10),
      },
      order: {
        stock: 'ASC',
      },
      take: 5,
      relations: ['category'],
    });

    const recentInvoices = await this.invoiceRepository.find({
      order: { date: 'DESC' },
      take: 5,
      relations: ['customer'],
      withDeleted: true,
    });

    return {
      totalSalesToday: totalSalesToday.total || 0,
      totalSalesThisMonth: totalSalesThisMonth.total || 0,
      lowStockProducts,
      recentInvoices,
    };
  }

  async getSalesByCategory(): Promise<{ categoryName: string; total: number }[]> {
    const salesByCategory = await this.invoiceDetailRepository
      .createQueryBuilder('invoiceDetail')
      .select('category.categoryName', 'categoryName')
      .addSelect('SUM(invoiceDetail.subtotal)', 'total')
      .innerJoin('invoiceDetail.product', 'product')
      .innerJoin('product.category', 'category')
      .groupBy('category.categoryName')
      .orderBy('total', 'DESC')
      .getRawMany();

    return salesByCategory.map(item => ({ ...item, total: Number(item.total) }));
  }
}
