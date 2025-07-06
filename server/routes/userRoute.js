const express = require('express');
const { registerUser, currentUser, loginUser, aficherUser, affecterRole } = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/current', validateToken, currentUser);
router.get('/afficher', validateToken, aficherUser);        // PROTÉGÉ la liste utilisateurs aussi !
router.put('/role/:userId', validateToken, affecterRole);

module.exports = router;
