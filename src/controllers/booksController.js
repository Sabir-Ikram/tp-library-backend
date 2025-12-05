const { Book } = require('../models');
const { Op } = require('sequelize');

module.exports = {

  // GET /books
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.findAll();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /books/:id
  getBookById: async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);

      if (!book) {
        return res.status(404).json({ error: 'Livre introuvable' });
      }

      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /books
  createBook: async (req, res) => {
    try {
      const { titre, auteur, edition } = req.body;

      if (!titre || !auteur || !edition) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
      }

      const newBook = await Book.create({ titre, auteur, edition });
      res.status(201).json(newBook);

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PUT /books/:id
  updateBook: async (req, res) => {
    try {
      const { titre, auteur, edition } = req.body;
      const book = await Book.findByPk(req.params.id);

      if (!book) {
        return res.status(404).json({ error: 'Livre introuvable' });
      }

      await book.update({ titre, auteur, edition });
      res.json(book);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /books/:id
  deleteBook: async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);

      if (!book) {
        return res.status(404).json({ error: 'Livre introuvable' });
      }

      await book.destroy();
      res.json({ message: 'Livre supprimé avec succès' });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /books/search/:titre
  searchBooks: async (req, res) => {
    try {
      const books = await Book.findAll({
        where: {
          titre: { [Op.iLike]: `%${req.params.titre}%` }
        }
      });

      res.json(books);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
