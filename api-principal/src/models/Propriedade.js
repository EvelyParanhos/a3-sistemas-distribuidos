const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Cliente = require('./Cliente');
const Produto = require('./Produto');
const Venda = require('./Venda');

const Propriedade = sequelize.define('Propriedade', {
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numeroSerie: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  dataAquisicao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'propriedades',
  timestamps: false
});

Propriedade.belongsTo(Cliente, { foreignKey: 'clienteId' });
Propriedade.belongsTo(Produto, { foreignKey: 'produtoId' });
Propriedade.belongsTo(Venda, { foreignKey: 'vendaId' });

module.exports = Propriedade;
