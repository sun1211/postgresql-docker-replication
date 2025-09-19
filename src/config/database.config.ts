// database.config.ts
import { DataSource } from 'typeorm';
import { dataSource } from './orm.config';

export const getDBConnection = async (): Promise<DataSource> => {
  try {
    if (dataSource.isInitialized) return dataSource;
    await dataSource.initialize();

    console.info('Connected to PostgreSQL with read/write separation enabled');

    return dataSource;
  } catch (err) {
    console.error('Database connection ERROR:', err);
    throw err;
  }
};

// Helper function to get a specific connection for transactions
export const getWriteConnection = async () => {
  const connection = await getDBConnection();
  return connection;
};

export const getReadConnection = async () => {
  const connection = await getDBConnection();
  return connection;
};