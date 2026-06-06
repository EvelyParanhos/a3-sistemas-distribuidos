const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Venda = require('./Venda');
const Produto = require('./Produto');

const ItemVenda = sequelize.define('ItemVenda', {
  vendaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precoUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'itens_venda'
});

Venda.hasMany(ItemVenda, { foreignKey: 'vendaId', as: 'itens' });
ItemVenda.belongsTo(Venda, { foreignKey: 'vendaId' });
ItemVenda.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });

module.exports = ItemVenda;
