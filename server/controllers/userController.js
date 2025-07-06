const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ nom, prenom, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const aficherUser = asyncHandler(async (req, res) => {
  const users = await User.find({}, "_id nom prenom email role");
  res.status(200).json(users);
});

const affecterRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const validRoles = ['ADMIN', 'AGENT', 'VALIDEUR'];

  if (!role) {
    res.status(400);
    throw new Error("Role is required");
  }

  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role value");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  await user.save();

  res.json({
    message: "Role updated successfully",
    user,
  });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  aficherUser,
  affecterRole
};
