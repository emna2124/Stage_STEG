const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const transporter = require('../config/nodemailer'); 
const { EMAIL_USER, ACCESS_TOKEN_SECRET } = process.env;

const registerUser = asyncHandler(async (req, res) => {
  const { nom, prenom, email, password, matricule } = req.body;

  if (!nom || !prenom || !email || !password || !matricule) {
    res.status(400);
    throw new Error("Tous les champs sont obligatoires");
  }

  const userExists = await User.findOne({ $or: [{ email }, { matricule }] });
  if (userExists) {
    res.status(400);
    throw new Error("L'utilisateur existe déjà (email ou matricule déjà utilisé)");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

  const user = await User.create({ 
    nom, 
    prenom, 
    email,
    matricule,
    password: hashedPassword,
    verificationCode,
    verificationCodeExpires,
    isApproved: false
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Vérification de votre compte",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Vérification de votre compte</h2>
        <p>Bonjour ${prenom},</p>
        <p>Merci de vous être inscrit. Voici votre code de vérification :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #2563eb;">${verificationCode}</h1>
        </div>
        <p>Ce code expirera dans 15 minutes.</p>
        <p>Votre compte sera activé après vérification par l'administrateur.</p>
        <p>Si vous n'avez pas demandé cette inscription, veuillez ignorer cet email.</p>
        <p>Cordialement,<br>L'équipe STEG</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erreur d'envoi d'email:", error);
      return res.status(500).json({ message: "Erreur lors de l'envoi du code de vérification" });
    }
    
    res.status(201).json({
      message: "Code de vérification envoyé par email",
      email: user.email,
      pendingVerification: true
    });
  });
});

const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  if (user.verificationCode !== code) {
    return res.status(400).json({ message: "Code de vérification incorrect" });
  }

  if (user.verificationCodeExpires < new Date()) {
    return res.status(400).json({ message: "Le code de vérification a expiré" });
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  res.status(200).json({ 
    message: "Compte vérifié avec succès. En attente d'approbation par l'administrateur.",
    user: {
      id: user._id,
      nom: user.nom,
      email: user.email,
      isApproved: user.isApproved
    }
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  if (!user.isVerified) {
    return res.status(401).json({ 
      message: "Compte non vérifié. Veuillez vérifier votre email.",
      requiresVerification: true,
      email: user.email
    });
  }

  if (!user.isApproved) {
    return res.status(401).json({ 
      message: "Compte en attente d'approbation par l'administrateur",
      requiresApproval: true
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Mot de passe incorrect" });
  }

  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    message: "Connexion réussie",
    token,
    user: {
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      matricule: user.matricule,
      role: user.role,
    }
  });
});

const resendCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

  user.verificationCode = verificationCode;
  user.verificationCodeExpires = verificationCodeExpires;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Nouveau code de vérification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nouveau code de vérification</h2>
        <p>Voici votre nouveau code de vérification :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #2563eb;">${verificationCode}</h1>
        </div>
        <p>Ce code expirera dans 15 minutes.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erreur d'envoi d'email:", error);
      return res.status(500).json({ message: "Erreur lors de l'envoi du code" });
    }
    
    res.status(200).json({ message: "Nouveau code envoyé avec succès" });
  });
});

const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id, "-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordExpires");
  
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  res.status(200).json(user);
});


const afficherUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, "-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordExpires");
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur dans afficherUser:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

const affecterRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const validRoles = ['Admin', 'Agent'];

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role value" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "Role updated successfully",
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        matricule: user.matricule,
        role: user.role,
        isApproved: user.isApproved
      },
    });
  } catch (error) {
    console.error("Erreur dans affecterRole:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

const toggleApproveUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { approved } = req.body;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false,
        message: "ID utilisateur invalide"
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isApproved: approved },
      { new: true }
    );

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: updatedUser.email,
        subject: approved ? "Votre compte a été approuvé" : "Votre compte a été désactivé",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">${approved ? "Compte approuvé" : "Compte désactivé"}</h2>
            <p>Bonjour ${updatedUser.prenom},</p>
            <p>${approved ? "Votre compte a été approuvé par l'administrateur." : "Votre compte a été désactivé par l'administrateur."}</p>
            <p>Cordialement,<br>L'équipe STEG</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Erreur d'envoi d'email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: approved ? "Utilisateur approuvé avec succès" : "Utilisateur désactivé avec succès",
      user: updatedUser
    });

  } catch (error) {
    console.error("Erreur dans toggleApproveUser:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors de la modification du statut",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ Status: "User not found" });
  }

  const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2d" });

  const resetUrl = `http://localhost:5173/reset-password/${user._id}/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Réinitialisation du mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Réinitialisation du mot de passe</h2>
        <p>Bonjour ${user.prenom},</p>
        <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Réinitialiser le mot de passe
          </a>
        </div>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <p>Cordialement,<br>L'équipe STEG</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erreur SMTP :", error);
      return res.status(500).json({ Status: "Erreur SMTP", error: error.message });
    }

    res.status(200).json({ Status: "Success" });
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { newpassword } = req.body;

  if (!newpassword || newpassword.length < 6) {
    return res.status(400).json({
      Status: 'Error',
      Message: 'Le mot de passe doit contenir au moins 6 caractères'
    });
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          Status: 'Error',
          Message: 'Lien invalide ou expiré'
        });
      }

      if (decoded.id !== id) {
        return res.status(401).json({
          Status: 'Error',
          Message: 'Token invalide'
        });
      }

      const hashedPassword = await bcrypt.hash(newpassword, 10);
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      
      res.json({ 
        Status: 'Success',
        Message: 'Mot de passe mis à jour avec succès'
      });
    });
  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({
      Status: 'Error',
      Message: 'Erreur serveur'
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  afficherUser,
  getUserById,
  affecterRole,
  forgotPassword,
  resetPassword,
  verifyCode,
  resendCode,
  toggleApproveUser
};