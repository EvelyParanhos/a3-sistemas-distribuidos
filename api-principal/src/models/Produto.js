const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Produto = sequelize.define('Produto', {
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  genero: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  descricao: DataTypes.TEXT,
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantidadeEstoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  estoqueMinimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'produtos',
  paranoid: true
});

module.exports = Produto;
