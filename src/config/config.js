require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
  }
};
