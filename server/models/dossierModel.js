const mongoose = require('mongoose');
const dossierSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please enter a title"],
    },
    description: {
        type: String,
        required: [true, "please enter a description"],
    },
    date_creation: {
        type: Date,
        default: Date.now,
    },
    date_validation: {
        type: Date,
        default: null,
    },
    services:{
        type: String,
        enum: ['informatique', 'auxiliaire', 'climatisation'],
        default: ['informatique'],
        //required: [true, "please enter at least one service"],
    },
    fichiers: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['En cours', 'validé', 'refusé', 'clôturé'],
        default: 'En cours',
    },

});

module.exports = mongoose.model('Dossier', dossierSchema);