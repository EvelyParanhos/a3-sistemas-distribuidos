const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Cliente = require('./Cliente');
const Vendedor = require('./Vendedor');

const Venda = sequelize.define('Venda', {
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendedorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  tableName: 'vendas'
});

Venda.belongsTo(Cliente, { foreignKey: 'clienteId' });
Venda.belongsTo(Vendedor, { foreignKey: 'vendedorId' });

module.exports = Venda;
