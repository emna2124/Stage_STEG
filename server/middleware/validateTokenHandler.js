const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    console.log("Middleware validateToken déclenché");
    
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            console.log("Erreur: Format d'autorisation invalide");
            return res.status(401).json({
                success: false,
                message: "Format d'autorisation invalide. Utilisez 'Bearer [token]'"
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token || token === 'null' || token === 'undefined') {
            console.log("Erreur: Token non fourni");
            return res.status(401).json({
                success: false,
                message: "Token d'authentification manquant"
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Modification ici pour utiliser _id au lieu de id
        if (!decoded._id || !decoded.role) {
            console.log("Erreur: Token invalide - données utilisateur manquantes");
            return res.status(401).json({
                success: false,
                message: "Token invalide - données utilisateur incomplètes"
            });
        }

        req.user = {
            id: decoded._id,  // Ici on utilise _id comme dans le payload
            role: decoded.role,
            email: decoded.email
        };
        
        next();
    } catch (error) {
        console.error("Erreur de validation du token:", error);
        
        let message = "Échec de l'authentification";
        let statusCode = 401;
        
        if (error.name === 'TokenExpiredError') {
            message = "Session expirée - veuillez vous reconnecter";
        } else if (error.name === 'JsonWebTokenError') {
            message = "Token invalide";
        } else if (error.name === 'NotBeforeError') {
            message = "Token pas encore valide";
            statusCode = 403;
        }

        return res.status(statusCode).json({ 
            success: false,
            message,
            expired: error.name === 'TokenExpiredError',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = validateToken;