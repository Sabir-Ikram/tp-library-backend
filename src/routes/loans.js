const router = require('express').Router();
const auth = require('../middlewares/auth');
const loansController = require('../controllers/loansController');

router.post('/', auth, loansController.createLoan);
router.get('/:userId', auth, loansController.getLoansByUser);
router.delete('/:loanId', auth, loansController.deleteLoan);

module.exports = router;
