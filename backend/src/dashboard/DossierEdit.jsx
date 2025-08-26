import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaCalendarAlt, FaMoneyBillWave, FaFileAlt, FaFolderOpen, FaPlus, FaTrash } from 'react-icons/fa';
import './UpdateDossier.css';

const DossierEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    objet: "",
    service_concerne: "",
    demandeur: "",
    status: "En cours",
    numero_demande_achat: "",
    date_demande_achat: "",
    prix_estimatif: "",
    reference: "",
    date_demande_prix: "",
    numero_consultation: "",
    date_consultation: "",
    numero_appel_offre: "",
    date_appel_offre: "",
    date_depouillement: "",
    numero_bon_commande: "",
    date_bon_commande: "",
    montant: "",
    date_livraison: "",
    etapes: []
  });
  const [newEtape, setNewEtape] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeSection, setActiveSection] = useState("informations");

  const statusOptions = [
    "En cours",
    "Validé",
    "Rejeté",
    "Terminé",
    "Archivé"
  ];

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Vous devez être connecté");
        }

        const response = await fetch(`http://localhost:3001/api/dossiers/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          const formattedData = {
            ...data,
            date_demande_achat: data.date_demande_achat ? new Date(data.date_demande_achat).toISOString().split('T')[0] : "",
            date_demande_prix: data.date_demande_prix ? new Date(data.date_demande_prix).toISOString().split('T')[0] : "",
            date_consultation: data.date_consultation ? new Date(data.date_consultation).toISOString().split('T')[0] : "",
            date_appel_offre: data.date_appel_offre ? new Date(data.date_appel_offre).toISOString().split('T')[0] : "",
            date_depouillement: data.date_depouillement ? new Date(data.date_depouillement).toISOString().split('T')[0] : "",
            date_bon_commande: data.date_bon_commande ? new Date(data.date_bon_commande).toISOString().split('T')[0] : "",
            date_livraison: data.date_livraison ? new Date(data.date_livraison).toISOString().split('T')[0] : "",
            etapes: data.etapes || []
          };
          setFormData(formattedData);
        } else {
          throw new Error(data.message || "Dossier non trouvé ou accès non autorisé");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du dossier:", error);
        setMessage({ text: error.message, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossier();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEtape = () => {
    if (newEtape.trim()) {
      setFormData(prev => ({
        ...prev,
        etapes: [...prev.etapes, newEtape.trim()]
      }));
      setNewEtape("");
    }
  };

  const handleRemoveEtape = (index) => {
    setFormData(prev => ({
      ...prev,
      etapes: prev.etapes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Vous devez être connecté");
      }

      if (!formData.objet || !formData.service_concerne || !formData.demandeur || !formData.status) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      const response = await fetch(`http://localhost:3001/api/dossiers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          text: "Dossier mis à jour avec succès !", 
          type: "success" 
        });
        setTimeout(() => navigate(-1), 2000);
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du dossier:", error);
      setMessage({ 
        text: error.message || "Erreur serveur", 
        type: "error" 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="dossier-edit-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dossier-edit-container">
      <div className="dossier-edit-card">
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Retour
          </button>
          <h1>Modifier le Dossier</h1>
          <div className="header-actions">
            <div className={`status-badge status-${formData.status.toLowerCase().replace('é', 'e')}`}>
              {formData.status}
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-navigation">
          <button 
            className={activeSection === "informations" ? "active" : ""}
            onClick={() => setActiveSection("informations")}
          >
            <FaFileAlt /> Informations
          </button>
          <button 
            className={activeSection === "demande" ? "active" : ""}
            onClick={() => setActiveSection("demande")}
          >
            <FaMoneyBillWave /> Demande
          </button>
          <button 
            className={activeSection === "consultation" ? "active" : ""}
            onClick={() => setActiveSection("consultation")}
          >
            <FaFileAlt /> Consultation
          </button>
          <button 
            className={activeSection === "commande" ? "active" : ""}
            onClick={() => setActiveSection("commande")}
          >
            <FaMoneyBillWave /> Commande
          </button>
          <button 
            className={activeSection === "etapes" ? "active" : ""}
            onClick={() => setActiveSection("etapes")}
          >
            <FaFolderOpen /> Étapes
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {(activeSection === "informations") && (
            <div className="form-section active">
              <h2><FaFileAlt /> Informations de base</h2>
              <div className="form-group">
                <label>Objet *</label>
                <input
                  type="text"
                  name="objet"
                  value={formData.objet}
                  onChange={handleChange}
                  required
                  className="modern-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service_concerne">
                    <FaFolderOpen className="input-icon" /> Service concerné *
                  </label>
                  <input
                    type="text"
                    id="service_concerne"
                    name="service_concerne"
                    placeholder="Service concerné"
                    value={formData.service_concerne}
                    onChange={handleChange}
                    required
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="demandeur">
                    <FaFolderOpen className="input-icon" /> Demandeur *
                  </label>
                  <input
                    type="text"
                    id="demandeur"
                    name="demandeur"
                    placeholder="Demandeur"
                    value={formData.demandeur}
                    onChange={handleChange}
                    required
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label>Statut *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="modern-select"
                  >
                    <option value="">Sélectionnez un statut</option>
                    {statusOptions.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {(activeSection === "demande") && (
            <div className="form-section active">
              <h2><FaMoneyBillWave /> Demande d'achat</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>N° Demande d'achat</label>
                  <input
                    type="text"
                    name="numero_demande_achat"
                    value={formData.numero_demande_achat || ""}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date demande d'achat</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date_demande_achat"
                      value={formData.date_demande_achat}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Prix estimatif</label>
                  <div className="input-with-icon">
                    <FaMoneyBillWave className="input-icon" />
                    <input
                      type="number"
                      name="prix_estimatif"
                      value={formData.prix_estimatif || ""}
                      onChange={handleChange}
                      step="0.01"
                      className="modern-input"
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Référence</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference || ""}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date demande de prix</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date_demande_prix"
                      value={formData.date_demande_prix}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeSection === "consultation") && (
            <div className="form-section active">
              <h2><FaFileAlt /> Consultation</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>N° Consultation</label>
                  <input
                    type="text"
                    name="numero_consultation"
                    value={formData.numero_consultation || ""}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date consultation</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date_consultation"
                      value={formData.date_consultation}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>N° Appel d'offre</label>
                  <input
                    type="text"
                    name="numero_appel_offre"
                    value={formData.numero_appel_offre || ""}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date appel d'offre</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date_appel_offre"
                      value={formData.date_appel_offre}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Date dépouillement</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date_depouillement"
                      value={formData.date_depouillement}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeSection === "commande") && (
            <div className="form-section active">
              <h2><FaMoneyBillWave /> Bon de commande</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>N° Bon de commande</label>
                  <input
                    type="text"
                    name="numero_bon_commande"
                    value={formData.numero_bon_commande || ""}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date bon de commande</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date_bon_commande"
                      value={formData.date_bon_commande}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Montant</label>
                  <div className="input-with-icon">
                    <FaMoneyBillWave className="input-icon" />
                    <input
                      type="number"
                      name="montant"
                      value={formData.montant || ""}
                      onChange={handleChange}
                      step="0.01"
                      className="modern-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Date livraison</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date_livraison"
                      value={formData.date_livraison}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeSection === "etapes") && (
            <div className="form-section active">
              <h2>Étapes du dossier</h2>
              <div className="etapes-container">
                {formData.etapes.map((etape, index) => (
                  <div key={index} className="etape-item">
                    <span className="etape-number">{index + 1}.</span>
                    <span className="etape-text">{etape}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveEtape(index)}
                      className="remove-etape"
                      title="Supprimer cette étape"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                
                {formData.etapes.length === 0 && (
                  <div className="no-etapes">
                    Aucune étape définie pour ce dossier
                  </div>
                )}
              </div>
              <div className="add-etape">
                <div className="input-with-button">
                  <input
                    type="text"
                    value={newEtape}
                    onChange={(e) => setNewEtape(e.target.value)}
                    placeholder="Ajouter une nouvelle étape"
                    className="modern-input"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddEtape}
                    className="add-etape-button"
                    disabled={!newEtape.trim()}
                  >
                    <FaPlus /> Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="submit-button">
              <FaSave /> Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DossierEdit;