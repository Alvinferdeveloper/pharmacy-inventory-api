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

  async backup(): Promise<string> {
    const fileName = `backup-${new Date().toISOString().replace(/:/g, '-')}.sql`;
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

  async getBackups(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(this.backupDir, (err, files) => {
        if (err) {
          reject('Unable to scan backup directory');
        } else {
          resolve(files);
        }
      });
    });
  }

  async restore(fileName: string): Promise<void> {
    const filePath = path.join(this.backupDir, fileName);
    const command = `mysql -u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD} ${process.env.DB_DATABASE} < ${filePath}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error restoring from backup: ${stderr}`);
        } else {
          resolve();
        }
      });
    });
  }
}
