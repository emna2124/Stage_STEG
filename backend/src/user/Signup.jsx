import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./login.css";

import logo from "../assets/logoS.png";

function Signup() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/users/register", {
        nom,
        prenom,
        email,
        matricule,
        password,
      });

      if (response.data.pendingVerification) {
        localStorage.setItem("pendingEmail", email);
        navigate("/codeAuth");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgetpass-container">
      <div className="forgetpass-card">
        <Link to="/" className="back-button">
          Retour
        </Link>
        
        <div className="forgetpass-header">
          <div className="icon-container">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Inscription</h1>
          <p>Créez votre compte pour accéder à la plateforme</p>
        </div>
        
        <form onSubmit={handleSubmit} className="forgetpass-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">
              Nom
            </label>
            <input
              type="text"
              className="email-input"
              placeholder="Entrez votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Prénom
            </label>
            <input
              type="text"
              className="email-input"
              placeholder="Entrez votre prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Matricule
            </label>
            <input
              type="text"
              className="email-input"
              placeholder="Entrez votre matricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              required
            />
          </div>

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
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Inscription...
              </>
            ) : (
              <>
                S'inscrire
              </>
            )}
          </button>
        </form>
        
        <div className="forgetpass-footer">
          <p>Déjà inscrit ? <Link to="/" className="login-link">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;