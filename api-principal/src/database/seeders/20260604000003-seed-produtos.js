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
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'O Cortiço',
        autor: 'Aluísio Azevedo',
        genero: 'Naturalismo',
        preco: 24.50,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Memórias Póstumas de Brás Cubas',
        autor: 'Machado de Assis',
        genero: 'Realismo',
        preco: 32.00,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'A Hora da Estrela',
        autor: 'Clarice Lispector',
        genero: 'Ficção Psicológica',
        preco: 19.90,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Capitães da Areia',
        autor: 'Jorge Amado',
        genero: 'Modernismo',
        preco: 27.80,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Sagarana',
        autor: 'Guimarães Rosa',
        genero: 'Regionalismo',
        preco: 35.00,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Vidas Secas',
        autor: 'Graciliano Ramos',
        genero: 'Modernismo',
        preco: 22.00,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'O Alienista',
        autor: 'Machado de Assis',
        genero: 'Realismo',
        preco: 15.00,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Quincas Borba',
        autor: 'Machado de Assis',
        genero: 'Realismo',
        preco: 28.00,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Iracema',
        autor: 'José de Alencar',
        genero: 'Romantismo',
        preco: 18.50,
        emCatalogo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('produtos', null, {});
  }
};
