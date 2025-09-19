// orm.config.ts
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  entities: [
    `${__dirname}/../**/*.entity.{ts,js}`,
  ],
  migrations: [
    `${__dirname}/../../migrations/*.{ts,js}`,
  ],
  replication: {
    master: {
      host: "localhost", // or "localhost" if running locally
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "development_database",
    },
    slaves: [
      {
        host: "localhost", // or "localhost" if running locally  
        port: 5433, // replica port
        username: "postgres", // use postgres user for reads
        password: "postgres",
        database: "development_database",
      },
    ],
  },
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  poolSize: 10,
  // Connection pool settings for better performance
  extra: {
    connectionLimit: 10,
    acquireTimeoutMillis: 60000,
    timeout: 60000,
    // Enable connection pooling
    max: 10,
    min: 2,
  },
});