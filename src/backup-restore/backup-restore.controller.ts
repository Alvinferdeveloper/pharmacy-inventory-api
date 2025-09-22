import { Controller, Post, UseGuards, Res, Body, InternalServerErrorException, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BackupRestoreService } from './backup-restore.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';
import type { Response } from 'express';
import * as path from 'path';

@Controller('database')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleName.ADMINISTRATOR)
export class BackupRestoreController {
  constructor(private readonly backupRestoreService: BackupRestoreService) { }

  @Post('backup')
  async backup(@Res() res: Response, @Body() body: { description?: string }) {
    try {
      const filePath = await this.backupRestoreService.backup(body.description);
      const fileName = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error sending backup file:', err);
          throw new InternalServerErrorException('Could not send backup file.');
        }
        // Clean up the file after sending
        this.backupRestoreService.cleanupBackupFile(filePath);
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create backup');
    }
  }


  @Post('restore')
  @UseInterceptors(FileInterceptor('file'))
  async restore(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    try {
      await this.backupRestoreService.restore(file);
      return { message: 'Database restored successfully' };
    } catch (error) {
      throw new InternalServerErrorException("Failed to restore database");
    }
  }
}
