import { DataSource, DeepPartial } from 'typeorm';
import { User } from '../entities/User.entity';
import { Role, RoleName } from '../entities/Role.entity';
import { Category } from '../entities/Category.entity';
import { Customer } from '../entities/Customer.entity';
import { Invoice } from '../entities/Invoice.entity';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { InventoryMovement } from '../entities/InventoryMovement.entity';
import { Product } from '../entities/Product.entity';
import { Supplier } from '../entities/Supplier.entity';
import 'dotenv/config';

async function seedData() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'pharmacy_inventory',
    entities: [
      User, Role, Category, Customer, Invoice, InvoiceDetail, InventoryMovement, Product, Supplier
    ],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Base de datos conectada para el sembrado.');

  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const categoryRepository = dataSource.getRepository(Category);
  const supplierRepository = dataSource.getRepository(Supplier);
  const customerRepository = dataSource.getRepository(Customer);
  const productRepository = dataSource.getRepository(Product);
  const invoiceRepository = dataSource.getRepository(Invoice);
  const invoiceDetailRepository = dataSource.getRepository(InvoiceDetail);
  const inventoryMovementRepository = dataSource.getRepository(InventoryMovement);

  try {
    // Seed Roles
    const roles = await roleRepository.save([
      { roleName: RoleName.ADMINISTRATOR, description: 'Acceso total al sistema' },
      { roleName: RoleName.SALESMAN, description: 'Puede gestionar ventas y clientes' },
      { roleName: RoleName.CONSULTANT, description: 'Puede ver datos pero no modificar' },
    ]);
    console.log('Roles sembrados.');

    // Seed Users
    const users: DeepPartial<User>[] = [
      {
        name: 'Miguel Herrera',
        identification: '001-010190-0001A',
        phone: '8888-8888',
        email: 'miguel@example.com',
        password: 'password123', // Será hasheada por el hook BeforeInsert
        role: roles[2], // ADMINISTRATOR
        mustChangePassword: false,
      },
      {
        name: 'Juan Pérez',
        identification: '001-020292-0002B',
        phone: '8777-7777',
        email: 'juan.perez@example.com',
        password: 'password123',
        role: roles[1], // SALESMAN
        mustChangePassword: false,
      }
    ];
    const createdUsers = await userRepository.save(userRepository.create(users));
    console.log('Usuarios sembrados.');

    // Seed Categories
    const categories: DeepPartial<Category>[] = [
      { categoryName: 'Analgésicos', description: 'Medicamentos para aliviar el dolor.' },
      { categoryName: 'Antibióticos', description: 'Medicamentos para tratar infecciones bacterianas.' },
      { categoryName: 'Antihistamínicos', description: 'Medicamentos para las alergias.' },
      { categoryName: 'Vitaminas y Suplementos', description: 'Productos para complementar la dieta.' },
      { categoryName: 'Cuidado Personal', description: 'Productos de higiene y cuidado personal.' },
    ];
    const createdCategories = await categoryRepository.save(categories);
    console.log('Categorías sembradas.');

    // Seed Suppliers
    const suppliers: DeepPartial<Supplier>[] = [
      { supplierName: 'Distribuidora Farmacéutica S.A.', address: 'Managua, Nicaragua', phone: '2222-2222', email: 'ventas@disfarma.com.ni' },
      { supplierName: 'Medix Nicaragua', address: 'León, Nicaragua', phone: '2333-3333', email: 'contacto@medix.com.ni' },
      { supplierName: 'Suplidores Médicos', address: 'Estelí, Nicaragua', phone: '2444-4444', email: 'info@sumedicos.com' },
    ];
    const createdSuppliers = await supplierRepository.save(suppliers);
    console.log('Proveedores sembrados.');

    // Seed Customers
    const customers: DeepPartial<Customer>[] = [
      { customerName: 'Maria Rodriguez', identification: '001-150788-0003C', phone: '8666-6666', address: 'Managua' },
      { customerName: 'Carlos Lopez', identification: '281-200495-0004D', phone: '8555-5555', address: 'Masaya' },
      { customerName: 'Ana Martinez', identification: '043-051180-0005E', phone: '8444-4444', address: 'Granada' },
      { customerName: 'Juan Perez', identification: '001-020292-0002B', phone: '8777-7777', address: 'Masaya' },
      { customerName: 'Pedro Ramirez', identification: '001-030393-0003C', phone: '8666-6666', address: 'Managua' },

    ];
    const createdCustomers = await customerRepository.save(customers);
    console.log('Clientes sembrados.');

    // Seed Products
    const products: DeepPartial<Product>[] = [
      { code: 'P001', productName: 'Acetaminofén 500mg', description: 'Caja con 100 tabletas', purchasePrice: 50, sellingPrice: 75, stock: 100, expirationDate: new Date('2026-12-31'), category: createdCategories[0], supplier: createdSuppliers[0] },
      { code: 'P002', productName: 'Amoxicilina 250mg', description: 'Frasco con suspensión 60ml', purchasePrice: 80, sellingPrice: 120, stock: 50, expirationDate: new Date('2025-10-20'), category: createdCategories[1], supplier: createdSuppliers[1] },
      { code: 'P003', productName: 'Loratadina 10mg', description: 'Caja con 10 tabletas', purchasePrice: 30, sellingPrice: 45, stock: 80, expirationDate: new Date('2027-05-15'), category: createdCategories[2], supplier: createdSuppliers[0] },
      { code: 'P004', productName: 'Vitamina C 1000mg', description: 'Tubo con 20 tabletas efervescentes', purchasePrice: 120, sellingPrice: 180, stock: 120, expirationDate: new Date('2026-08-30'), category: createdCategories[3], supplier: createdSuppliers[2] },
      { code: 'P005', productName: 'Jabón Antibacterial', description: 'Barra de 90g', purchasePrice: 15, sellingPrice: 25, stock: 200, expirationDate: new Date('2028-01-01'), category: createdCategories[4], supplier: createdSuppliers[1] },
    ];
    const createdProducts = await productRepository.save(products);
    console.log('Productos sembrados.');

    // Seed Invoices
    const invoices: DeepPartial<Invoice>[] = [];
    for (let i = 0; i < 5; i++) {
      const invoiceDetails: DeepPartial<InvoiceDetail>[] = [];
      let total = 0;

      const product1 = createdProducts[i];
      const quantity1 = 2;
      const subtotal1 = Number(product1.sellingPrice) * quantity1;
      total += subtotal1;

      invoiceDetails.push({
        product: product1,
        quantity: quantity1,
        unitPrice: product1.sellingPrice,
        subtotal: subtotal1,
      });

      if (i < 2) {
        const product2 = createdProducts[i + 2];
        const quantity2 = 1;
        const subtotal2 = Number(product2.sellingPrice) * quantity2;
        total += subtotal2;

        invoiceDetails.push({
          product: product2,
          quantity: quantity2,
          unitPrice: product2.sellingPrice,
          subtotal: subtotal2,
        });
      }

      function randomDateLastMonth() {
        const end = new Date(); // hoy
        const start = new Date();
        start.setDate(start.getDate() - 30); // hace 30 días

        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTime);
      }

      const invoice = {
        customer: createdCustomers[i],
        user: createdUsers[1], // Vendedor Juan Pérez
        total: total,
        tax: total * 0.15, // 15% IVA
        discount: 0,
        invoiceDetails,
        date: randomDateLastMonth(),
      };
      invoices.push(invoice);
    }
    await invoiceRepository.save(invoices);
    console.log('Facturas sembradas.');

    console.log('¡Sembrado de datos completado!');

  } catch (error) {
    console.error('Error sembrando datos:', error);
  } finally {
    await dataSource.destroy();
    console.log('Conexión a la base de datos cerrada.');
  }
}

seedData();