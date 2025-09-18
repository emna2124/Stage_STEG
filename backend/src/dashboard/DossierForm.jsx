import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use named import
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
  const [isInitialized, setIsInitialized] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = localStorage.getItem('token');

  const serviceOptions = [
    { value: "", label: "Sélectionnez un service" },
    { value: "T210", label: "T210" },
    { value: "T211", label: "T211" },
    { value: "T212", label: "T212" },
    { value: "T213", label: "T213" }
  ];

  useEffect(() => {
    if (!userInfo || !token) {
      console.log('No userInfo or token, redirecting to login');
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token); // Use jwtDecode
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.log('Token expired, clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          navigate('/login');
        } else if (!isInitialized) {
          setFormData(prev => ({
            ...prev,
            demandeur: userInfo.matricule || ""
          }));
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    }
  }, [navigate, userInfo, token, isInitialized]);

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

      if (!userInfo.uniteFonctionnelle) {
        throw new Error("Unité fonctionnelle manquante pour l'utilisateur");
      }

      const dossierData = {
        objet: formData.objet,
        service_concerne: formData.service_concerne,
        demandeur: formData.demandeur,
        userMatricule: userInfo.matricule,
        uniteFonctionnelle: userInfo.uniteFonctionnelle
      };

      console.log('Données envoyées au serveur:', dossierData);
      console.log('Authorization header:', `Bearer ${token}`);

      const response = await axios.post("http://localhost:3001/api/dossiers", dossierData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      setMessage({ 
        text: "Dossier créé avec succès ! Redirection en cours...", 
        type: "success" 
      });

      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data || error);
      setMessage({ 
        text: error.response?.data?.message || error.message, 
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
            <select
              id="service_concerne"
              name="service_concerne"
              value={formData.service_concerne}
              onChange={handleChange}
              className={errors.service_concerne ? 'error' : ''}
            >
              {serviceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              readOnly
              className="read-only-input"
            />
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