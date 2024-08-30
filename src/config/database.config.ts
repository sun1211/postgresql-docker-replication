import { DataSource, Repository } from 'typeorm';
import { dataSource } from './orm.config';
import { writerDataSource } from './writerOrm.config';


export const getDBConnection = async (): Promise<DataSource> => {
  try {
    if (dataSource.isInitialized) return dataSource;
    await dataSource.initialize();

    console.info(`Connected to DB.`);

    return dataSource;
  } catch (err) {
    console.error(`createConnection ERROR: ${err}`);
    throw err;
  }
};

export const getWriterDBConnection = async (): Promise<DataSource> => {
  try {
    if (writerDataSource.isInitialized) return writerDataSource;
    await writerDataSource.initialize();
    console.info(`Connected to writer DB.`);
    return writerDataSource;
  } catch (err) {
    console.error(`createConnection ERROR: ${err}`);
    throw err;
  }
};

// export const getRepository = async <T>(entity: { new (): T }): Promise<Repository<T>> => {
//   const db = await getDBConnection();
//   return db.getRepository(entity);
// };

// export const getEntityRepository = async <T>(
//   entity: { new (): T },
//   db: DataSource,
// ): Promise<Repository<T>> => {
//   return db.getRepository(entity);
// };
