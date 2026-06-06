const { Sequelize } = require('sequelize');
const config = require('./config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.host === 'db' ? { ...config } : { ...config, host: 'localhost' }
);

module.exports = sequelize;
