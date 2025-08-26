import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3001/api/dossiers/all", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setDossiers(data);
        } else {
          setMessage(`❌ Erreur : ${data.message}`);
        }
      } catch (error) {
        setMessage("❌ Erreur serveur.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  const onEdit = (dossierId) => {
    navigate(`/dossiers/${dossierId}/edit`);
  };

  const onViewHistory = (dossierId) => {
    navigate(`/dossiers/${dossierId}/history`);
  };
  const onViewDetails = (dossierId) => {
    navigate(`/dossiers/${dossierId}/details`);
  };

  const toggleExpand = (dossierId) => {
    setExpandedDossier(expandedDossier === dossierId ? null : dossierId);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  // Filtrage et pagination
  const filteredDossiers = dossiers.filter(dossier => {
    return (
      dossier.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dossier.reference && dossier.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      dossier.service_concerne.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.demandeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastDossier = currentPage * dossiersPerPage;
  const indexOfFirstDossier = indexOfLastDossier - dossiersPerPage;
  const currentDossiers = filteredDossiers.slice(indexOfFirstDossier, indexOfLastDossier);
  const totalPages = Math.ceil(filteredDossiers.length / dossiersPerPage);

  if (isLoading) {
    return <div className="dossier-container">Chargement en cours...</div>;
  }

  return (
    <div className="dossier-container">
      <div className="dossier-header">
        <h2>Gestion des Dossiers</h2>
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
                      <span className={`status-badge status-${d.status.toLowerCase().replace('é', 'e')}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>{formatDate(d.date_creation)}</td>
                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => onEdit(d._id)} 
                        className="btn-action btn-edit"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onViewHistory(d._id)}
                        className="btn-action btn-history"
                        title="Historique"
                      >
                        ⏳
                      </button>
                      <button
                        onClick={() => onViewDetails(d._id)}
                        className="btn-action btn-details"
                        title="Details"
                      >
                        📋
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
                              <p><strong>Statut:</strong> <span className={`status-badge status-${d.status.toLowerCase().replace('é', 'e')}`}>{d.status}</span></p>
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

                            {d.etapes && d.etapes.length > 0 && (
                              <div className="details-group full-width">
                                <h4>Étapes du dossier</h4>
                                <ul className="etapes-list">
                                  {d.etapes.map((etape, index) => (
                                    <li key={index}>{etape}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
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