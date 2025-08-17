import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'pharmacy_inventory',
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
        timezone: 'Z',
      });

      return dataSource.initialize();
    },
  },
];