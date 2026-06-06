const { Sequelize } = require('sequelize');
const RelatorioStrategy = require('./RelatorioStrategy');
const sequelize = require('../database');

class MaisVendidosStrategy extends RelatorioStrategy {
  async execute() {
    const query = `
      SELECT p.titulo, SUM(iv.quantidade) as total_vendido
      FROM produtos p
      JOIN itens_venda iv ON p.id = iv.produtoId
      JOIN vendas v ON v.id = iv.vendaId
      WHERE v.status = 'confirmada'
      GROUP BY p.id, p.titulo
      ORDER BY total_vendido DESC
    `;
    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
  }
}

module.exports = MaisVendidosStrategy;
