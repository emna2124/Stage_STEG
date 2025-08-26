import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHistory, FaSearch } from 'react-icons/fa';
import './DossierHistory.css';

const DossierHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Vous devez être connecté");

        const response = await fetch(`http://localhost:3001/api/dossiers/${id}/history`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
          setHistory(data);
          setFilteredHistory(data);
        } else {
          throw new Error(data.message || "Erreur lors du chargement de l'historique");
        }
      } catch (error) {
        setMessage({ text: error.message, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  // Filtrage
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    setFilteredHistory(
      history.filter((entry) => {
        const date = new Date(entry.date).toLocaleString('fr-FR');
        const action = entry.action?.toLowerCase() || "";
        const user = entry.utilisateur
          ? `${entry.utilisateur.nom} ${entry.utilisateur.prenom}`.toLowerCase()
          : "";

        return (
          date.toLowerCase().includes(lowerTerm) ||
          action.includes(lowerTerm) ||
          user.includes(lowerTerm)
        );
      })
    );
  }, [searchTerm, history]);

  if (isLoading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  return (
    <div className="history-container">
      <div className="history-card">
        <div className="history-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Retour
          </button>
          <h1><FaHistory /> Historique du Dossier</h1>
        </div>

        {/* Barre de recherche */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par date, action ou utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {filteredHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{new Date(entry.date).toLocaleString('fr-FR')}</td>
                  <td>{entry.action}</td>
                  <td>
                    {entry.utilisateur
                      ? `${entry.utilisateur.nom} ${entry.utilisateur.prenom}`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-history">Aucun historique trouvé pour cette recherche.</p>
        )}
      </div>
    </div>
  );
};

export default DossierHistory;
