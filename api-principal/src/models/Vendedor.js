const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Vendedor = sequelize.define('Vendedor', {
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
  comissaoPercentual: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  tableName: 'vendedores'
});

module.exports = Vendedor;
