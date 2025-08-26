import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

import logo from "../assets/logoS.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/users/login", {
        email,
        password,
      });

      if (response.data.requiresVerification) {
        localStorage.setItem("pendingEmail", response.data.email);
        navigate("/codeAuth");
        return;
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Stocker les informations utilisateur séparément pour un accès facile
        localStorage.setItem("userInfo", JSON.stringify({
          id: response.data.user.id,
          nom: response.data.user.nom,
          prenom: response.data.user.prenom,
          email: response.data.user.email,
          matricule: response.data.user.matricule,
          role: response.data.user.role
        }));

        if (response.data.user.role === "Admin") {
          navigate("/dashboard");
        } else if (response.data.user.role === "Agent") {
          navigate("/agentDashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
      console.error("Erreur lors de la connexion :", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgetpass-container">
      <div className="forgetpass-card">
        <div className="forgetpass-header">
          <div className="icon-container">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Connexion</h1>
          <p>Entrez vos identifiants pour accéder à votre compte</p>
        </div>
        
        <form onSubmit={handleSubmit} className="forgetpass-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">
              Email
            </label>
            <input
              type="email"
              className="email-input"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Mot de passe
            </label>
            <input
              type="password"
              className="email-input"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group d-flex justify-content-between align-items-center">
            <label className="input-label" style={{margin: 0}}>
              <input type="checkbox" className="me-1" />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password" className="login-link">Mot de passe oublié?</Link>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Connexion...
              </>
            ) : (
              <>
                Se connecter
              </>
            )}
          </button>
        </form>
        
        <div className="forgetpass-footer">
          <p>Pas encore de compte ? <Link to="/register" className="login-link">S'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;