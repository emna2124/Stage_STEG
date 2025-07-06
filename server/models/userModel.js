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
    email: {
        type: String,
        required: [true, "SVP entez votre email"],
        unique: [true, "Cet email est déjà utilisé"]
    },
    role: {
        type: String,
        enum: ['ADMIN', 'AGENT', 'VALIDEUR'],
        default: 'AGENT',
    },
    password: {
        type: String,
        required: [true, "SVP entez votre password"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);