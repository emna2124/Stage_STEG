// middleware/validateAdminHandler.js
const validateAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ 
      success: false,
      message: "Accès refusé - Privilèges administrateur requis" 
    });
  }
  next();
};

module.exports = validateAdmin;