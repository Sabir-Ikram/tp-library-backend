const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = {

  // GET /users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /users/:id
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /users
  createUser: async (req, res) => {
    try {
      const { nom, prenom, age, ecole, email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const hashed = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        nom,
        prenom,
        age,
        ecole,
        email,
        password: hashed
      });

      const { password: _, ...userData } = newUser.toJSON();
      res.status(201).json(userData);

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PUT /users/:id
  updateUser: async (req, res) => {
    try {
      const { password } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      if (password) {
        req.body.password = await bcrypt.hash(password, 10);
      }

      await user.update(req.body);

      const { password: _, ...userData } = user.toJSON();
      res.json(userData);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /users/:id
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      await user.destroy();
      res.json({ message: 'Utilisateur supprimé avec succès' });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /users/search/:name
  searchUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          nom: { [Op.iLike]: `%${req.params.name}%` }
        },
        attributes: { exclude: ['password'] }
      });

      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
