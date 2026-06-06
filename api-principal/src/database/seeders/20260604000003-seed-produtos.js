'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('produtos', null, {});
    await queryInterface.bulkInsert('produtos', [
      {
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        genero: 'Literatura Brasileira',
        preco: 29.90,
        quantidadeEstoque: 10,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'O Cortiço',
        autor: 'Aluísio Azevedo',
        genero: 'Naturalismo',
        preco: 24.50,
        quantidadeEstoque: 3,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Memórias Póstumas de Brás Cubas',
        autor: 'Machado de Assis',
        genero: 'Realismo',
        preco: 32.00,
        quantidadeEstoque: 15,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'A Hora da Estrela',
        autor: 'Clarice Lispector',
        genero: 'Ficção Psicológica',
        preco: 19.90,
        quantidadeEstoque: 4,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Capitães da Areia',
        autor: 'Jorge Amado',
        genero: 'Modernismo',
        preco: 27.80,
        quantidadeEstoque: 20,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Sagarana',
        autor: 'Guimarães Rosa',
        genero: 'Regionalismo',
        preco: 35.00,
        quantidadeEstoque: 1,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Vidas Secas',
        autor: 'Graciliano Ramos',
        genero: 'Modernismo',
        preco: 22.00,
        quantidadeEstoque: 12,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'O Alienista',
        autor: 'Machado de Assis',
        genero: 'Realismo',
        preco: 15.00,
        quantidadeEstoque: 8,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Quincas Borba',
        autor: 'Machado de Assis',
        genero: 'Realismo',
        preco: 28.00,
        quantidadeEstoque: 6,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Iracema',
        autor: 'José de Alencar',
        genero: 'Romantismo',
        preco: 18.50,
        quantidadeEstoque: 2,
        estoqueMinimo: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('produtos', null, {});
  }
};
