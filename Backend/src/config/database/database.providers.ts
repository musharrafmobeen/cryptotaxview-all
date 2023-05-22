// import { createConnection } from 'typeorm';

// export const databaseProviders = [
//   {
//     provide: 'DATABASE_CONNECTION',
//     useFactory: async () =>
//       await createConnection({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//         username: 'postgres',
//         password: '1234',
//         database: 'cryptotaxview',
//         entities: [__dirname + '/../../models/**/entities/*.entity{.ts,.js}'],
//         synchronize: true,
//       }),
//   },
// ];

import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      await createConnection({
        type: process.env.type,
        host: process.env.host,
        port: process.env.dbport,
        username: process.env.user,
        password: process.env.password,
        database: process.env.database,

        entities: [__dirname + '/../../models/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  },
];

// import { createConnection } from 'typeorm';

// export const databaseProviders = [
//   {
//     provide: 'DATABASE_CONNECTION',
//     useFactory: async () =>
//       await createConnection({
//         type: 'postgres',
//         host: '4.tcp.ngrok.io',
//         port: 16800,
//         username: 'postgres',
//         password: '0423',
//         database: 'typeorm_db',
//         entities: [__dirname + '/../../models/**/entities/*.entity{.ts,.js}'],
//         synchronize: true,
//       }),
//   },
// ];
