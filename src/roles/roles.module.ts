import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { roleProviders } from '../providers/role.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [RolesService, ...roleProviders],
  exports: [RolesService]
})
export class RolesModule {}
