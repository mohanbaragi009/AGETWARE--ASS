const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // SQLite file in project root
  logging: false
});

module.exports = sequelize;
