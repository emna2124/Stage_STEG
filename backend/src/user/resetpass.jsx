import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './forgetpass.css';

import logo from "../assets/logoS.png";

function ResetPass() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation simple
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/reset-password/${id}/${token}`,
        { newpassword: password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.Status === 'Success') {
        setSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(response.data.Message || 'Erreur inconnue');
      }
    } catch (err) {
      let errorMessage = 'Erreur de connexion au serveur';
      if (err.response) {
        errorMessage = err.response.data.Message || errorMessage;
      }
      setError(errorMessage);
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
          <h1>Réinitialiser le mot de passe</h1>
          <p>Entrez votre nouveau mot de passe</p>
        </div>
        
        <form onSubmit={handleSubmit} className="forgetpass-form">
          {success && (
            <div className="success-message">
              Mot de passe réinitialisé avec succès! Redirection...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <span className="material-icons message-icon">error</span>
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="email-input"
              placeholder="Entrez votre nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              className="email-input"
              placeholder="Confirmez votre nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
                Traitement...
              </>
            ) : (
              <>
                Réinitialiser
              </>
            )}
          </button>
        </form>
        
        <div className="forgetpass-footer">
          <p>Revenir à la <Link to="/" className="login-link">connexion</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;