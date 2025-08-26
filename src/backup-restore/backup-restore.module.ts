import { Module } from '@nestjs/common';
import { BackupRestoreService } from './backup-restore.service';
import { BackupRestoreController } from './backup-restore.controller';

@Module({
  controllers: [BackupRestoreController],
  providers: [BackupRestoreService]
})
export class BackupRestoreModule { }
