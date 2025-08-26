import React, { useState } from "react";
import axios from "axios";
import "./forgetpass.css";
import { useNavigate, Link } from "react-router-dom";

import logo from "../assets/logoS.png";

function FactoryAuth() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/users/verify-code", {
        email,
        code
      });

      if (response.status === 200) {
        localStorage.removeItem("pendingEmail");
        alert(response.data.message);
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la vérification");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await axios.post("http://localhost:3001/api/users/resend-code", { email });
      alert("Un nouveau code a été envoyé à votre email");
    } catch (error) {
      console.error("Erreur lors de l'envoi du code:", error);
      alert("Erreur lors de l'envoi du code");
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
          <h1>Vérification du compte</h1>
          <p>Un code de vérification a été envoyé à {email}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="forgetpass-form">
          {error && (
            <div className="error-message">
              <span className="material-icons message-icon">error</span>
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">
              Code de vérification
            </label>
            <input
              type="text"
              className="email-input"
              placeholder="Entrez le code à 6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength="6"
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
                Vérification...
              </>
            ) : (
              <>
                Vérifier
              </>
            )}
          </button>
        </form>
        
        <div className="forgetpass-footer">
          <p>Vous n'avez pas reçu de code ?</p>
          <button 
            onClick={resendCode}
            className="login-link"
            style={{background: 'none', border: 'none', padding: 0}}
          >
            Renvoyer le code
          </button>
        </div>
      </div>
    </div>
  );
}

export default FactoryAuth;