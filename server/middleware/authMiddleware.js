const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Fetch user from database to include matricule
      const user = await User.findById(decoded._id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('Utilisateur non trouvé');
      }

      req.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        matricule: user.matricule,
        nom: user.nom,
        prenom: user.prenom
      };

      next();
    } catch (error) {
      console.error('Erreur dans verifyToken:', error);
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  } else {
    res.status(401);
    throw new Error('Non autorisé, aucun token fourni');
  }
});

module.exports = { verifyToken };