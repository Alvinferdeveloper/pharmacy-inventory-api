import { Controller, Post, UseGuards, Res, Get, Body, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { BackupRestoreService } from './backup-restore.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';

@Controller('database')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleName.ADMINISTRATOR)
export class BackupRestoreController {
  constructor(private readonly backupRestoreService: BackupRestoreService) { }

  @Post('backup')
  async backup() {
    try {
      await this.backupRestoreService.backup();
      return { message: 'Backup created successfully' };
    } catch (error) {
      return { message: 'Failed to create backup', error };
    }
  }

  @Get('backups')
  async getBackups() {
    try {
      const backups = await this.backupRestoreService.getBackups();
      return backups;
    } catch (error) {
      return { message: 'Failed to get backups', error };
    }
  }

  @Post('restore')
  async restore(@Body() body: { fileName: string }) {
    try {
      await this.backupRestoreService.restore(body.fileName);
      return { message: 'Database restored successfully' };
    } catch (error) {
      throw new InternalServerErrorException("Failed to restore database");
    }
  }
}
