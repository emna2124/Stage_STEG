const express = require('express');
const router = express.Router();
const {
  getdossiers,
  createdossier,
  getdossierById,
  updatedossier,
  deletedossier,
} = require('../controllers/dossierController');

router.route("/").get(getdossiers);

router.route("/").post(createdossier);

router.route("/:id").get(getdossierById);

router.route("/:id").put(updatedossier);

router.route("/:id").delete(deletedossier);

module.exports = router;