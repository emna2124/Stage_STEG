import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
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

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userInfo || !token) {
      navigate('/');
    }
  }, [navigate, userInfo, token]);

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
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (!userInfo?.matricule) {
        throw new Error("Utilisateur non connecté ou matricule manquant");
      }

      const dossierData = {
        ...formData,
        userMatricule: userInfo.matricule
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

      // Redirection vers la page précédente
      setTimeout(() => navigate(-1), 2000);

    } catch (error) {
      setMessage({ 
        text: error.message, 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userInfo || !token) {
    return <div>Redirection vers la connexion...</div>;
  }

  return (
    <div className="dossier-form-container">
      <div className="dossier-form-card">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Retour
        </button>
        
        <div className="form-header">
          <FaFolderOpen className="header-icon" />
          <h1>Nouveau Dossier</h1>
          <p>Créez un nouveau dossier en remplissant les informations ci-dessous</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dossier-form">
          <div className="form-group">
            <label htmlFor="objet">Objet du dossier *</label>
            <input
              type="text"
              id="objet"
              name="objet"
              placeholder="Objet du dossier"
              value={formData.objet}
              onChange={handleChange}
              className={errors.objet ? 'error' : ''}
            />
            {errors.objet && <span className="error-text">{errors.objet}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="service_concerne">Service concerné *</label>
            <input
              type="text"
              id="service_concerne"
              name="service_concerne"
              placeholder="Service concerné"
              value={formData.service_concerne}
              onChange={handleChange}
              className={errors.service_concerne ? 'error' : ''}
            />
            {errors.service_concerne && <span className="error-text">{errors.service_concerne}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="demandeur">Demandeur *</label>
            <input
              type="text"
              id="demandeur"
              name="demandeur"
              placeholder="Demandeur"
              value={formData.demandeur}
              onChange={handleChange}
              className={errors.demandeur ? 'error' : ''}
            />
            {errors.demandeur && <span className="error-text">{errors.demandeur}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            <FaPaperPlane /> 
            {isSubmitting ? "En cours..." : "Créer le dossier"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DossierForm;
