import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { permissionProviders } from './permissions.providers';
import { PermissionsRepository } from './permissions.repository';
import { DatabaseModule } from 'src/config/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    PermissionsRepository,
    ...permissionProviders,
  ],
})
export class PermissionsModule {}
