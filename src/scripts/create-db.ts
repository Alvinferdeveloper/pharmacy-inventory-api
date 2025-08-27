import 'dotenv/config';
import mysql from 'mysql2/promise';

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_ROOT_USERNAME,
    password: process.env.DB_ROOT_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
  await connection.query(`CREATE USER IF NOT EXISTS '${process.env.DB_USERNAME}'@'localhost' IDENTIFIED BY '${process.env.DB_PASSWORD}'`);
  await connection.query(`GRANT ALL PRIVILEGES ON ${process.env.DB_DATABASE}.* TO '${process.env.DB_USERNAME}'@'localhost'`);
  await connection.end();
}

initDatabase();
