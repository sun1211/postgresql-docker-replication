import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',

  entities: [
    `${__dirname}/../**/*.entity.{ts,js}`,
  ],

  replication: {
    master: {
      host: "192.168.1.13",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "development_database",
    },
    slaves: [
      {
        host: "192.168.1.13",
        port: 5433,
        username: "repl_user",
        password: "repl_user",
        database: "development_database",
      },
    ],
  },
  synchronize: false,
  logging: false,
  poolSize: 10,
});
