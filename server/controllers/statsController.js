// controllers/statsController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Dossier = require("../models/dossierModel");

const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDossiers = await Dossier.countDocuments();

  const dossiersParStatut = await Dossier.aggregate([
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $project: { statut: "$_id", value: 1, _id: 0 } }
  ]);

  const dossiersParMois = await Dossier.aggregate([
    {
      $group: {
        _id: { $month: "$date_creation" },
        nombre: { $sum: 1 }
      }
    },
    { $project: { mois: "$_id", nombre: 1, _id: 0 } },
    { $sort: { mois: 1 } }
  ]);

  // Nouveaux graphiques
  const usersParMatricule = await User.aggregate([
    { $group: { _id: "$matricule", count: { $sum: 1 } } },
    { $project: { matricule: "$_id", count: 1, _id: 0 } }
  ]);

  const dossiersParStatutTriangle = await Dossier.aggregate([
    { $group: { _id: "$status", nombre: { $sum: 1 } } },
    { $project: { statut: "$_id", nombre: 1, _id: 0 } }
  ]);

  const dossiersParAnnee = await Dossier.aggregate([
    { $group: { _id: { $year: "$date_creation" }, total: { $sum: 1 } } },
    { $project: { annee: "$_id", total: 1, _id: 0 } },
    { $sort: { annee: 1 } }
  ]);

  const dernierUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("nom prenom email matricule role");

  res.json({
    totalUsers,
    totalDossiers,
    dossiersValides: await Dossier.countDocuments({ status: "Validé" }),
    dossiersEnCours: await Dossier.countDocuments({ status: "En cours" }),
    dossiersParStatut,
    dossiersParMois,
    usersParMatricule,
    dossiersParStatutTriangle,
    dossiersParAnnee,
    dernierUsers
  });
});

module.exports = { getStats };
