const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  titre: DataTypes.STRING,
  auteur: DataTypes.STRING,
  edition: DataTypes.STRING
});

module.exports = Book;
