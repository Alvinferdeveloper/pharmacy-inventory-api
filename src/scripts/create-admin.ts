import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { Role, RoleName } from '../entities/Role.entity';
import { Category } from '../entities/Category.entity';
import { Customer } from '../entities/Customer.entity';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { Invoice } from '../entities/Invoice.entity';
import { InventoryMovement } from '../entities/InventoryMovement.entity';
import { Product } from '../entities/Product.entity';
import { Supplier } from '../entities/Supplier.entity';
import 'dotenv/config';

async function createAdminUser() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      User,
      Role,
      Category,
      Customer,
      InvoiceDetail,
      Invoice,
      InventoryMovement,
      Product,
      Supplier,
    ],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database connected for admin creation.');

  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  try {
    // Find or create Administrator role
    let adminRole = await roleRepository.findOne({ where: { roleName: RoleName.ADMINISTRATOR } });
    if (!adminRole) {
      adminRole = roleRepository.create({
        roleName: RoleName.ADMINISTRATOR,
        description: 'Administrator role with full access',
      });
      await roleRepository.save(adminRole);
      console.log('Administrator role created.');
    } else {
      console.log('Administrator role already exists.');
    }

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({ where: { identification: 'admin' } });
    if (existingAdmin) {
      console.log('Admin user already exists. Exiting.');
      await dataSource.destroy();
      return;
    }

    // Create admin user
    const adminUser = userRepository.create({
      name: 'Eddy Urbina Obando',
      identification: '777-250700-1100P',
      phone: '77675646',
      email: 'admin@admin.com',
      password: '12345678', // This will be hashed by the BeforeInsert hook
      role: adminRole,
    });

    await userRepository.save(adminUser);
    console.log('Admin user created successfully!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
}

createAdminUser();