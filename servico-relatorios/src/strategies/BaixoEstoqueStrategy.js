const { Sequelize } = require('sequelize');
const RelatorioStrategy = require('./RelatorioStrategy');
const sequelize = require('../database');

class BaixoEstoqueStrategy extends RelatorioStrategy {
  async execute() {
    const query = `
      SELECT titulo, quantidadeEstoque, estoqueMinimo
      FROM produtos
      WHERE quantidadeEstoque <= estoqueMinimo AND ativo = true
    `;
    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
  }
}

module.exports = BaixoEstoqueStrategy;
