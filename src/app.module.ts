import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule, CategoryModule, UserModule, SupplierModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}