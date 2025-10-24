const { Loan, Book, User } = require('../models');
const { Op } = require('sequelize');

// 📍 Créer un prêt
exports.createLoan = async (req, res) => {
  try {
    const { userId, bookId, startDate, endDate } = req.body;

    const s = new Date(startDate);
    const e = new Date(endDate);

    // Vérif cohérence dates
    if (e <= s) return res.status(400).json({ error: 'End must be after start' });
    const diffDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    if (diffDays > 15) return res.status(400).json({ error: 'Max loan 15 days' });

    // Vérifier que l'utilisateur n'a pas déjà 2 prêts en même temps
    const overlappingLoans = await Loan.count({
      where: {
        userId,
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } }
        ]
      }
    });
    if (overlappingLoans >= 2) {
      return res.status(400).json({ error: 'User already has 2 books in this period' });
    }

    // Vérifier que le livre n’est pas déjà prêté pendant cette période
    const bookConflict = await Loan.count({
      where: {
        bookId,
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } }
        ]
      }
    });
    if (bookConflict > 0) {
      return res.status(400).json({ error: 'Book not available in this period' });
    }

    // Créer le prêt
    const loan = await Loan.create({ userId, bookId, startDate, endDate });
    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📍 Récupérer tous les prêts d’un utilisateur
exports.getLoansByUser = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: Book, attributes: ['titre', 'auteur', 'edition'] },
        { model: User, attributes: ['nom', 'prenom', 'email'] }
      ]
    });

    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📍 Supprimer un prêt
exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    await loan.destroy();
    res.json({ message: 'Loan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
