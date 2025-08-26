import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaUserCog, FaBuilding, FaPaperPlane, FaArrowLeft, FaFileAlt, FaUser, FaUsers } from 'react-icons/fa';
import './DossierForm.css';

const DossierForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    objet: "",
    service_concerne: "",
    demandeur: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});

  const services = [
    "Département approvisionnement",
    "Service logistique",
    "Service technique",
    "Direction financière",
    "Ressources humaines"
  ];

  const demandeurs = [
    "T210-DPSE",
    "T211-CNC-SE",
    "T212-CICR",
    "T213-CT",
    "T214-DAF",
    "T215-DRH"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.objet.trim()) {
      newErrors.objet = "L'objet du dossier est requis";
    } else if (formData.objet.trim().length < 5) {
      newErrors.objet = "L'objet doit contenir au moins 5 caractères";
    }
    
    if (!formData.service_concerne.trim()) {
      newErrors.service_concerne = "Le service concerné est requis";
    }
    
    if (!formData.demandeur.trim()) {
      newErrors.demandeur = "Le demandeur est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user?.matricule) {
        throw new Error("Utilisateur non connecté ou matricule manquant");
      }

      const dossierData = {
        ...formData,
        userMatricule: user.matricule
      };

      const response = await fetch("http://localhost:3001/api/dossiers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dossierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création du dossier");
      }

      setMessage({ 
        text: "Dossier créé avec succès ! Redirection en cours...", 
        type: "success" 
      });
      setTimeout(() => navigate("/agentDashboard"), 2000);
    } catch (error) {
      setMessage({ 
        text: error.message, 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dossier-form-container">
      <div className="dossier-form-card">
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Retour
          </button>
          <div className="header-content">
            <div className="header-icon-container">
              <FaFolderOpen className="header-icon" />
            </div>
            <h1>Nouveau Dossier</h1>
            <p>Créez un nouveau dossier en remplissant les informations ci-dessous</p>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <div className="message-content">
              {message.type === 'success' ? (
                <span className="message-icon">✓</span>
              ) : (
                <span className="message-icon">⚠</span>
              )}
              {message.text}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="dossier-form">
          <div className="form-section">
            <h2><FaFileAlt /> Informations du dossier</h2>
            
            <div className="form-group">
              <label htmlFor="objet" className="form-label">
                <FaFileAlt className="input-icon" /> Objet du dossier *
              </label>
              <input
                type="text"
                id="objet"
                name="objet"
                placeholder="Ex: Demande d'achat de matériel informatique"
                value={formData.objet}
                onChange={handleChange}
                className={errors.objet ? 'error' : ''}
              />
              {errors.objet && <span className="error-text">{errors.objet}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service_concerne" className="form-label">
                  <FaBuilding className="input-icon" /> Service concerné *
                </label>
                <div className="select-wrapper">
                  <select
                    id="service_concerne"
                    name="service_concerne"
                    value={formData.service_concerne}
                    onChange={handleChange}
                    className={errors.service_concerne ? 'error' : ''}
                  >
                    <option value="">Sélectionnez un service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                {errors.service_concerne && <span className="error-text">{errors.service_concerne}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="demandeur" className="form-label">
                  <FaUser className="input-icon" /> Demandeur *
                </label>
                <div className="select-wrapper">
                  <select
                    id="demandeur"
                    name="demandeur"
                    value={formData.demandeur}
                    onChange={handleChange}
                    className={errors.demandeur ? 'error' : ''}
                  >
                    <option value="">Sélectionnez un demandeur</option>
                    {demandeurs.map((demandeur, index) => (
                      <option key={index} value={demandeur}>{demandeur}</option>
                    ))}
                  </select>
                </div>
                {errors.demandeur && <span className="error-text">{errors.demandeur}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="cancel-button"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="loading-spinner"></div>
              ) : (
                <FaPaperPlane />
              )}
              {isSubmitting ? "Création en cours..." : "Créer le dossier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DossierForm;