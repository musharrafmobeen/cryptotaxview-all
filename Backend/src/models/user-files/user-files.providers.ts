import { UserFile } from './entities/user-file.entity';
import { Connection } from 'typeorm';

export const userFileProviders = [
  {
    provide: 'USER_FILE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(UserFile),
    inject: ['DATABASE_CONNECTION'],
  },
];
