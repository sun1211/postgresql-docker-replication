import { DataSource } from 'typeorm';

export const writerDataSource = new DataSource({
  type: 'postgres',
  entities: [
    `${__dirname}/../**/*.entity.{ts,js}`,
  ],
  host: "192.168.1.13",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "development_database",
  synchronize: false,
  logging: true,
});
