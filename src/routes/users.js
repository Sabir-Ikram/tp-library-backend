const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers
} = require('../controllers/usersController');

// GET all users
router.get('/', auth, getAllUsers);

// GET user by ID
router.get('/:id', auth, getUserById);

// POST create user
router.post('/', createUser);

// PUT update user
router.put('/:id', auth, updateUser);

// DELETE user
router.delete('/:id', auth, deleteUser);

// GET search users by name
router.get('/search/:name', auth, searchUsers);

module.exports = router;
