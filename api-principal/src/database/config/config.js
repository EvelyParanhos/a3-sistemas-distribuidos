require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'admin_pass',
    database: process.env.MYSQL_DATABASE || 'ebookstore_db',
    host: 'db',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'admin_pass',
    database: 'ebookstore_test_db',
    host: 'db',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: 'db',
    dialect: 'mysql',
    logging: false
  }
};
