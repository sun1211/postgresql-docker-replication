// database.config.ts
import { DataSource } from 'typeorm';
import { dataSource } from './orm.config';
import { writerDataSource } from './writerOrm.config';

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
export const getWriteConnection = async (): Promise<DataSource> => {
  try {
    if (writerDataSource.isInitialized) return writerDataSource;
    await writerDataSource.initialize();

    console.info('Writer database connection initialized');
    return writerDataSource;
  } catch (err) {
    console.error('Writer database connection ERROR:', err);
    throw err;
  }
};

export const getReadConnection = async () => {
  const connection = await getDBConnection();
  return connection;
};