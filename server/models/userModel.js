const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "SVP entez votre nom"],
  },
  prenom: {
    type: String,
    required: [true, "SVP entez votre prénom"],
  },
  matricule: {
    type: String,
    required: [true, "SVP entez votre matricule"],
    unique: [true, "Ce matricule est déjà utilisé"]
  },
  email: {
    type: String,
    required: [true, "SVP entez votre email"],
    unique: [true, "Cet email est déjà utilisé"]
  },
  uniteFonctionnelle: {
    type: String,
    required: [true, "SVP entez votre unité fonctionnelle"],
  },
  role: {
    type: String,
    enum: ['Agent', 'Admin'],
    default: 'Agent',
  },
  password: {
    type: String,
    required: [true, "SVP entez votre password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Use _id to match userController.js
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      matricule: this.matricule,
      uniteFonctionnelle: this.uniteFonctionnelle,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' } // Match userController.js
  );
};

module.exports = mongoose.model('User', userSchema);