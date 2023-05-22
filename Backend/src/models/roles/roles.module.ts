import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { rolesProviders } from './roles.providers';
import { DatabaseModule } from 'src/config/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, ...rolesProviders],
  exports: [RolesService, RolesRepository, ...rolesProviders],
})
export class RolesModule {}
