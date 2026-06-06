const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Cliente = sequelize.define('Cliente', {
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  cpf: {
    type: DataTypes.CHAR(11),
    allowNull: false,
    unique: true
  },
  telefone: DataTypes.STRING(20),
  endereco: DataTypes.STRING(255)
}, {
  tableName: 'clientes'
});

module.exports = Cliente;
