const { Sequelize } = require('sequelize');
const RelatorioStrategy = require('./RelatorioStrategy');
const sequelize = require('../database');

class PorClienteStrategy extends RelatorioStrategy {
  constructor(clienteId) {
    super();
    this.clienteId = clienteId;
  }

  async execute() {
    if (!this.clienteId) throw new Error('Cliente ID é obrigatório');
    
    const query = `
      SELECT p.titulo, pr.numeroSerie, pr.dataAquisicao, v.status as status_venda
      FROM propriedades pr
      JOIN produtos p ON p.id = pr.produtoId
      JOIN vendas v ON v.id = pr.vendaId
      WHERE pr.clienteId = :clienteId
    `;
    return sequelize.query(query, { 
      replacements: { clienteId: this.clienteId },
      type: Sequelize.QueryTypes.SELECT 
    });
  }
}

module.exports = PorClienteStrategy;
