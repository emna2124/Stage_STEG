const mongoose = require('mongoose');

const dossierSchema = new mongoose.Schema({
  objet: {
    type: String,
    required: true
  },
  service_concerne: {
    type: String,
    required: true
  },
  demandeur: {
    type: String,
    required: true
  },
  userMatricule: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'En cours',
    enum: ['En cours', 'Validé', 'Rejeté', 'Terminé', 'Archivé']
  },
  numero_demande_achat: String,
  date_demande_achat: Date,
  prix_estimatif: Number,
  reference: String,
  date_demande_prix: Date,
  numero_consultation: String,
  date_consultation: Date,
  numero_appel_offre: String,
  date_appel_offre: Date,
  date_depouillement: Date,
  numero_bon_commande: String,
  date_bon_commande: Date,
  montant: Number,
  date_livraison: Date,
  etapes: [String],
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  historique: [{
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      required: true
    }
  }],
  date_creation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dossier', dossierSchema);