const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Mot de passe d'application
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Vérification de la connexion SMTP au démarrage
transporter.verify((error) => {
  if (error) {
    console.error("Erreur de configuration SMTP:", error);
  } else {
    console.log("Serveur SMTP prêt");
  }
});

module.exports = transporter;