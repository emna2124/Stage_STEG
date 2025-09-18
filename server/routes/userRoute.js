const express = require('express');
const { 
  registerUser, 
  currentUser, 
  loginUser, 
  afficherUser, 
  getUserById,
  affecterRole, 
  forgotPassword, 
  resetPassword, 
  verifyCode, 
  resendCode,
  toggleApproveUser 
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware'); // Update to match

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/resend-code', resendCode);
router.post('/verify-code', verifyCode);
router.post('/current', verifyToken, currentUser);
router.get('/afficher', verifyToken, afficherUser);
router.get('/:id', verifyToken, getUserById);
router.put('/role/:userId', verifyToken, affecterRole);
router.put('/approve/:userId', verifyToken, toggleApproveUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;