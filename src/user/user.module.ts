import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from '../providers/user.providers';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { roleProviders } from '../providers/role.providers';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [UserService, ...userProviders, ...roleProviders],
  controllers: [UserController],
})
export class UserModule {}
