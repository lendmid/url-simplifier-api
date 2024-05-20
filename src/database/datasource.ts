import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'urls.sqlite',
  synchronize: false,
  entities: ['./**/*.entity.js'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsRun: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
