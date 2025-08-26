import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHistory } from 'react-icons/fa';
import './DossierHistory.css';

const DossierHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Vous devez être connecté");
        }

        const response = await fetch(`http://localhost:3001/api/dossiers/${id}/history`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          setHistory(data);
        } else {
          throw new Error(data.message || "Erreur lors du chargement de l'historique");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
        setMessage({ text: error.message, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  if (isLoading) {
    return <div className="dossier-history-container">Chargement en cours...</div>;
  }

  return (
    <div className="dossier-history-container">
      <div className="dossier-history-card">
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Retour
          </button>
          <h1><FaHistory /> Historique du Dossier</h1>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="history-section">
          <h2>Actions enregistrées</h2>
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={index}>
                  {new Date(entry.date).toLocaleString('fr-FR')}: {entry.action}
                  {entry.utilisateur && ` par ${entry.utilisateur.nom} ${entry.utilisateur.prenom}`}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun historique disponible pour ce dossier.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DossierHistory;