const asyncHandler = require('express-async-handler');
const Dossier = require('../models/dossierModel');
const getdossiers = asyncHandler (async (req, res) => {
    const dossiers = await Dossier.find();
    res.status(200).json(dossiers);
});

const createdossier = asyncHandler (async (req, res) => {
    console.log("The request body is:", req.body);
    const { title, description, date_creation, date_validation, fichiers, services, status } = req.body;
    if(!title || !description || !date_creation || !date_validation || !fichiers || !services || !status) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const dossier = await Dossier.create({
        title,
        description,
        date_creation,
        date_validation,
        fichiers,
        services,
        status
    });
    res.status(200).json(dossier);
})

const getdossierById = asyncHandler (async (req, res) => {
    const dossier = Dossier.findById(req.params.id);
    if(!dossier) {
        res.status(404);
        throw new Error("Dossier not found");
    }
    res.status(200).json(dossier);
})

const updatedossier = asyncHandler (async (req, res) => {
    const dossier = await Dossier.findById(req.params.id);
    if(!dossier) {
        res.status(404);
        throw new Error("Dossier not found");
    }
    const updatedDossier = await Dossier.findByIdAndUpdate(req.params.id, req.body, {new: true,});

    res.status(200).json(updatedDossier);
})

const deletedossier = asyncHandler (async (req, res) => {
    const dossier = await Dossier.findById(req.params.id);
    if(!dossier) {  
        res.status(404);
        throw new Error("Dossier not found");
    }
    await Dossier.remove();
    res.status(200).json(dossier);
})
        
module.exports = {
    getdossiers,
    createdossier,
    getdossierById,
    updatedossier,
    deletedossier
};
