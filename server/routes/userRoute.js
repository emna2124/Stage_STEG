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
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/resend-code', resendCode);
router.post('/verify-code', verifyCode);
router.post('/current', validateToken, currentUser);
router.get('/afficher', validateToken, afficherUser);
router.get('/:id', validateToken, getUserById);
router.put('/role/:userId', validateToken, affecterRole);
router.put('/approve/:userId', validateToken, toggleApproveUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;