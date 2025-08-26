const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getDossiers,
  createDossier,
  getDossierById,
  updateDossier,
  getDossierHistory,
  getALLDossiers
} = require('../controllers/dossierController');

router.use(verifyToken); // Apply middleware to all routes

router.route("/").get(getDossiers);
router.route("/all").get(getALLDossiers);
router.route("/").post(createDossier);
router.route("/:id").get(getDossierById);
router.route("/:id").put(updateDossier);
router.route("/:id/history").get(getDossierHistory);

module.exports = router;