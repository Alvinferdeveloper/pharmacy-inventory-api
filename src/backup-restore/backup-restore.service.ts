import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupRestoreService {
  private readonly backupDir = path.join(__dirname, '..\/..\/backups');

  constructor() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async backup(description?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const safeDescription = description ? `-${description.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    const fileName = `backup-${timestamp}${safeDescription}.sql`;
    const filePath = path.join(this.backupDir, fileName);

    const command = `mysqldump -u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD} ${process.env.DB_DATABASE} > ${filePath}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error creating backup: ${stderr}`);
        } else {
          resolve(filePath);
        }
      });
    });
  }


  async restore(file: Express.Multer.File): Promise<void> {
    const tempFileName = `restore-${Date.now()}.sql`;
    const tempFilePath = path.join(this.backupDir, tempFileName);

    return new Promise((resolve, reject) => {
      fs.writeFile(tempFilePath, file.buffer, (err) => {
        if (err) {
          return reject(`Failed to write temporary restore file: ${err.message}`);
        }

        const command = `mysql -u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD} ${process.env.DB_DATABASE} < ${tempFilePath}`;

        exec(command, (error, stdout, stderr) => {
          // Clean up the temporary file first
          fs.unlink(tempFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Failed to delete temporary restore file: ${tempFilePath}`, unlinkErr);
              // Do not reject here, as the main operation might have succeeded.
              // The primary error (if any) is more important.
            }

            if (error) {
              return reject(`Error restoring from backup: ${stderr}`);
            }
            resolve();
          });
        });
      });
    });
  }

  async cleanupBackupFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete backup file: ${filePath}`, err);
        }
        resolve();
      });
    });
  }
}
