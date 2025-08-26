import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaKey } from "react-icons/fa";
import "./Forgetpass.css";

import logo from "../assets/logoS.png";

function Forgetpass() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    
    try {
      const res = await axios.post(
        "http://localhost:3001/api/users/forgot-password", 
        { email }
      );

      if (res.data.Status === "Success") {
        setMessage("Un email de réinitialisation a été envoyé ! Vérifiez votre boîte mail.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError("Erreur : Le serveur ne répond pas. Réessayez plus tard.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgetpass-container">
      <div className="forgetpass-card">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Retour
        </button>
        
        <div className="forgetpass-header">
          <div className="icon-container">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Mot de passe oublié</h1>
          <p>Entrez votre adresse email pour réinitialiser votre mot de passe</p>
        </div>

        <form onSubmit={handleSubmit} className="forgetpass-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              <FaEnvelope className="input-icon" /> Adresse email
            </label>
            <input
              type="email"
              id="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input"
            />
          </div>

          {message && (
            <div className="success-message">
              <span className="message-icon">✓</span>
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="message-icon">⚠</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <FaPaperPlane />
            )}
            {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        <div className="forgetpass-footer">
          <p>
            Vous vous souvenez de votre mot de passe ?{" "}
            <span className="login-link" onClick={() => navigate("/")}>
              Se connecter
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Forgetpass;