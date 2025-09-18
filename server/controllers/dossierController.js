// controllers/dossierController.js
const asyncHandler = require('express-async-handler');
const Dossier = require('../models/dossierModel');

const getDossiers = asyncHandler(async (req, res) => {
  const { uniteFonctionnelle } = req.query;
  
  if (!uniteFonctionnelle) {
    return res.status(400).json({ message: "Unité fonctionnelle requise" });
  }

  const dossiers = await Dossier.find({ uniteFonctionnelle: uniteFonctionnelle })
    .populate('createur', 'nom prenom email');
  
  res.status(200).json(dossiers);
});

const createDossier = asyncHandler(async (req, res) => {
  const { objet, service_concerne, demandeur } = req.body;

  if (!objet || !service_concerne || !demandeur) {
    res.status(400);
    throw new Error("Tous les champs obligatoires doivent être remplis");
  }

  // Vérifier que l'utilisateur a une unité fonctionnelle
  if (!req.user.uniteFonctionnelle) {
    res.status(400);
    throw new Error("Unité fonctionnelle manquante pour l'utilisateur");
  }

  const dossier = await Dossier.create({
    objet,
    service_concerne,
    demandeur,
    userMatricule: req.user.matricule,
    uniteFonctionnelle: req.user.uniteFonctionnelle,
    _user: req.user._id,
    createur: req.user._id,
    historique: [{
      utilisateur: req.user._id,
      date: new Date(),
      action: `Création du dossier par ${req.user.nom} ${req.user.prenom}`
    }]
  });

  res.status(201).json(dossier);
});

const getDossierById = asyncHandler(async (req, res) => {
  const dossier = await Dossier.findById(req.params.id)
    .populate('createur', 'nom prenom email')
    .populate('historique.utilisateur', 'nom prenom email');

  if (!dossier) {
    res.status(404);
    throw new Error("Dossier non trouvé");
  }

  if (dossier.uniteFonctionnelle !== req.user.uniteFonctionnelle && !req.user.role.includes('Admin')) {
    res.status(403);
    throw new Error("Non autorisé : vous n'êtes pas membre de cette unité fonctionnelle");
  }
  
  const dossierWithFormattedDates = { ...dossier._doc };
  Object.keys(dossierWithFormattedDates).forEach(key => {
    if (dossierWithFormattedDates[key] instanceof Date) {
      dossierWithFormattedDates[key] = dossierWithFormattedDates[key].toISOString();
    }
  });

  res.status(200).json(dossierWithFormattedDates);
});

const updateDossier = asyncHandler(async (req, res) => {
  const dossier = await Dossier.findById(req.params.id);

  if (!dossier) {
    res.status(404);
    throw new Error("Dossier non trouvé");
  }

  if (dossier.uniteFonctionnelle !== req.user.uniteFonctionnelle && !req.user.role.includes('Admin')) {
    res.status(403);
    throw new Error("Non autorisé : vous n'êtes pas membre de cette unité fonctionnelle");
  }

  const updatableFields = [
    'objet', 'service_concerne', 'demandeur', 'status',
    'numero_demande_achat', 'date_demande_achat', 'prix_estimatif',
    'reference', 'date_demande_prix', 'numero_consultation',
    'date_consultation', 'numero_appel_offre', 'date_appel_offre',
    'date_depouillement', 'numero_bon_commande', 'date_bon_commande',
    'montant', 'date_livraison', 'etapes'
  ];

  // Log changes for history
  const historyEntries = [];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      const oldValue = dossier[field] !== undefined ? dossier[field] : null;
      const newValue = req.body[field] === '' ? null : req.body[field];
      
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        let actionDescription;
        if (field === 'etapes') {
          const added = newValue.filter(x => !oldValue?.includes(x));
          const removed = oldValue?.filter(x => !newValue.includes(x)) || [];
          if (added.length > 0) {
            historyEntries.push({
              utilisateur: req.user._id,
              date: new Date(),
              action: `Ajout des étapes: ${added.join(', ')} par ${req.user.nom} ${req.user.prenom}`
            });
          }
          if (removed.length > 0) {
            historyEntries.push({
              utilisateur: req.user._id,
              date: new Date(),
              action: `Suppression des étapes: ${removed.join(', ')} par ${req.user.nom} ${req.user.prenom}`
            });
          }
        } else {
          actionDescription = newValue !== null
            ? `Modification de ${field} de "${oldValue || 'vide'}" à "${newValue}" par ${req.user.nom} ${req.user.prenom}`
            : `Suppression de ${field} (précédemment "${oldValue}") par ${req.user.nom} ${req.user.prenom}`;
          historyEntries.push({
            utilisateur: req.user._id,
            date: new Date(),
            action: actionDescription
          });
        }
        dossier[field] = newValue;
      }
    }
  });

  // Add history entries to the dossier
  if (historyEntries.length > 0) {
    dossier.historique.push(...historyEntries);
  }

  dossier._original = dossier.toObject();
  dossier._user = req.user._id;

  const updatedDossier = await dossier.save();
  res.status(200).json(updatedDossier);
});

const getDossierHistory = asyncHandler(async (req, res) => {
  const dossier = await Dossier.findById(req.params.id)
    .select('objet reference historique uniteFonctionnelle')
    .populate('historique.utilisateur', 'nom prenom email');

  if (!dossier) {
    res.status(404);
    throw new Error("Dossier non trouvé");
  }

  if (dossier.uniteFonctionnelle !== req.user.uniteFonctionnelle && !req.user.role.includes('Admin')) {
    res.status(403);
    throw new Error("Non autorisé : vous n'êtes pas membre de cette unité fonctionnelle");
  }

  res.status(200).json(dossier.historique);
});

const getALLDossiers = asyncHandler(async (req, res) => {
  if (!req.user.role.includes('Admin')) {
    res.status(403);
    throw new Error("Non autorisé : accès réservé aux administrateurs");
  }
  const dossiers = await Dossier.find().populate('createur', 'nom prenom email');
  res.status(200).json(dossiers);
});

module.exports = {
  getDossiers,
  getDossierById,
  getDossierHistory,
  createDossier,
  updateDossier,
  getALLDossiers
};