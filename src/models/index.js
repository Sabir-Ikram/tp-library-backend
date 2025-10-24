const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');
const Loan = require('./loan');

module.exports = { sequelize, User, Book, Loan };
