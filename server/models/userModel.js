const mongoose = require('mongoose');

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

// Générer un token JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      matricule: this.matricule,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Méthode pour générer le JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      matricule: this.matricule,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = mongoose.model('User', userSchema);