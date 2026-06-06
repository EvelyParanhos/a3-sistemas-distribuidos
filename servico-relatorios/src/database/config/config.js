require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_READ || 'relatorio_user',
    password: process.env.DB_PASS_READ || 'relatorio_pass',
    database: process.env.MYSQL_DATABASE || 'ebookstore_db',
    host: 'db',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER_READ,
    password: process.env.DB_PASS_READ,
    database: process.env.MYSQL_DATABASE,
    host: 'db',
    dialect: 'mysql',
    logging: false
  }
};
