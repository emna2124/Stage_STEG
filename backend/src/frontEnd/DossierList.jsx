import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use named import
import { FaHistory } from 'react-icons/fa';
import "./DossierList.css";

const DossierList = () => {
  const [dossiers, setDossiers] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dossiersPerPage] = useState(10);
  const [expandedDossier, setExpandedDossier] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        if (!token || !userInfo?.uniteFonctionnelle) {
          throw new Error("Vous devez être connecté");
        }

        const decoded = jwtDecode(token); // Use jwtDecode
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.log('Token expired, clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }

        console.log('Authorization header:', `Bearer ${token}`);

        const response = await axios.get(
          `http://localhost:3001/api/dossiers?uniteFonctionnelle=${userInfo.uniteFonctionnelle}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        setDossiers(response.data);
      } catch (error) {
        setMessage(`❌ ${error.response?.data?.message || error.message}`);
        console.error('Erreur lors de la récupération des dossiers:', error.response?.data || error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossiers();
  }, [token, userInfo?.uniteFonctionnelle, navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const filteredDossiers = dossiers.filter(dossier => {
    const searchLower = searchTerm.toLowerCase();
    return (
      dossier.objet.toLowerCase().includes(searchLower) ||
      (dossier.reference?.toLowerCase().includes(searchLower)) ||
      dossier.service_concerne.toLowerCase().includes(searchLower) ||
      dossier.demandeur.toLowerCase().includes(searchLower) ||
      dossier.status.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastDossier = currentPage * dossiersPerPage;
  const indexOfFirstDossier = indexOfLastDossier - dossiersPerPage;
  const currentDossiers = filteredDossiers.slice(indexOfFirstDossier, indexOfLastDossier);
  const totalPages = Math.ceil(filteredDossiers.length / dossiersPerPage);

  const toggleExpand = (dossierId) => {
    setExpandedDossier(expandedDossier === dossierId ? null : dossierId);
  };

  if (isLoading) {
    return <div className="dossier-container">Chargement en cours...</div>;
  }

  if (!userInfo || !token) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dossier-container">
      <div className="dossier-header">
        <h2>Gestion des Dossiers - Unité: {userInfo.uniteFonctionnelle}</h2>
        <button className="btn-add" onClick={() => navigate("/dossiers/new")}>
          + Nouveau Dossier
        </button>
      </div>

      {message && <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

      <div className="dossier-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un dossier..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-count">
          {filteredDossiers.length} dossier(s) trouvé(s)
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Objet</th>
              <th>Référence</th>
              <th>Service</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDossiers.length > 0 ? (
              currentDossiers.map((d) => (
                <React.Fragment key={d._id}>
                  <tr className="dossier-row" onClick={() => toggleExpand(d._id)}>
                    <td>{d.objet}</td>
                    <td>{d.reference || "-"}</td>
                    <td>{d.service_concerne}</td>
                    <td>
                      <span className={`status-badge status-${d.status.toLowerCase().replace(' ', '-')}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>{formatDate(d.date_creation)}</td>
                    <td className="actions-cell">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dossiers/${d._id}/edit`);
                        }} 
                        className="btn-action btn-edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dossiers/${d._id}/history`);
                        }} 
                        className="btn-action btn-history"
                      >
                        <FaHistory />
                      </button>
                    </td>
                  </tr>
                  {expandedDossier === d._id && (
                    <tr className="details-row">
                      <td colSpan="6">
                        <div className="dossier-details">
                          <h3>Détails du dossier</h3>
                          <div className="details-grid">
                            <div className="details-group">
                              <h4>Informations de base</h4>
                              <p><strong>Objet:</strong> {d.objet}</p>
                              <p><strong>Référence:</strong> {d.reference || "-"}</p>
                              <p><strong>Service concerné:</strong> {d.service_concerne}</p>
                              <p><strong>Demandeur:</strong> {d.demandeur}</p>
                              <p><strong>Unité fonctionnelle:</strong> {d.uniteFonctionnelle}</p>
                              <p><strong>Statut:</strong> <span className={`status-badge status-${d.status.toLowerCase().replace(' ', '-')}`}>{d.status}</span></p>
                            </div>

                            <div className="details-group">
                              <h4>Demande d'achat</h4>
                              <p><strong>N° Demande:</strong> {d.numero_demande_achat || "-"}</p>
                              <p><strong>Date demande:</strong> {formatDate(d.date_demande_achat)}</p>
                              <p><strong>Prix estimatif:</strong> {formatCurrency(d.prix_estimatif)}</p>
                            </div>

                            <div className="details-group">
                              <h4>Consultation</h4>
                              <p><strong>N° Consultation:</strong> {d.numero_consultation || "-"}</p>
                              <p><strong>Date consultation:</strong> {formatDate(d.date_consultation)}</p>
                              <p><strong>N° Appel d'offre:</strong> {d.numero_appel_offre || "-"}</p>
                              <p><strong>Date appel d'offre:</strong> {formatDate(d.date_appel_offre)}</p>
                              <p><strong>Date dépouillement:</strong> {formatDate(d.date_depouillement)}</p>
                            </div>

                            <div className="details-group">
                              <h4>Bon de commande</h4>
                              <p><strong>N° Bon commande:</strong> {d.numero_bon_commande || "-"}</p>
                              <p><strong>Date bon commande:</strong> {formatDate(d.date_bon_commande)}</p>
                              <p><strong>Montant:</strong> {formatCurrency(d.montant)}</p>
                              <p><strong>Date livraison:</strong> {formatDate(d.date_livraison)}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  {searchTerm ? "Aucun résultat correspond à votre recherche" : "Aucun dossier disponible"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredDossiers.length > dossiersPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default DossierList;