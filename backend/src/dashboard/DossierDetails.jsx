import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaHistory, FaFileAlt, FaMoneyBillWave, FaFolderOpen, FaCalendarAlt, FaTag, FaUser, FaBuilding, FaListOl, FaClipboardList, FaTruckLoading, FaCheckCircle, FaTimesCircle, FaClock, FaArchive } from 'react-icons/fa';
import "./DossierDetails.css";

const DossierDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dossier, setDossier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        const fetchDossier = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/dossiers/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setDossier(data);
                } else {
                    throw new Error(data.message || "Erreur lors du chargement");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDossier();
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("fr-FR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return "-";
        return new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR' 
        }).format(amount);
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "Validé": return <FaCheckCircle />;
            case "Rejeté": return <FaTimesCircle />;
            case "En cours": return <FaClock />;
            case "Archivé": return <FaArchive />;
            case "Terminé": return <FaCheckCircle />;
            default: return <FaClock />;
        }
    };

    if (isLoading) {
        return (
            <div className="dossier-details-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement des détails du dossier...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dossier-details-container">
                <div className="error-message">
                    <h2>Erreur</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)} className="back-button">
                        <FaArrowLeft /> Retour
                    </button>
                </div>
            </div>
        );
    }

    if (!dossier) {
        return (
            <div className="dossier-details-container">
                <div className="not-found">
                    <h2>Dossier non trouvé</h2>
                    <p>Le dossier que vous recherchez n'existe pas ou a été supprimé.</p>
                    <button onClick={() => navigate(-1)} className="back-button">
                        <FaArrowLeft /> Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dossier-details-container">
            <div className="dossier-details-card">
                <div className="dossier-details-header">
                    <button onClick={() => navigate(-1)} className="back-button">
                        <FaArrowLeft /> Retour
                    </button>
                    <div className="header-title">
                        <h1>Détails du Dossier</h1>
                        <div className={`status-badge status-${dossier.status.toLowerCase().replace('é', 'e')}`}>
                            {getStatusIcon(dossier.status)}
                            <span>{dossier.status}</span>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button 
                            onClick={() => navigate(`/dossiers/${id}/edit`)}
                            className="edit-button"
                        >
                            <FaEdit /> Modifier
                        </button>
                        <button 
                            onClick={() => navigate(`/dossiers/${id}/history`)}
                            className="history-button"
                        >
                            <FaHistory /> Historique
                        </button>
                    </div>
                </div>

                <div className="dossier-tabs">
                    <button 
                        className={activeTab === 'general' ? 'active' : ''}
                        onClick={() => setActiveTab('general')}
                    >
                        <FaFileAlt /> Informations générales
                    </button>
                    <button 
                        className={activeTab === 'demande' ? 'active' : ''}
                        onClick={() => setActiveTab('demande')}
                    >
                        <FaMoneyBillWave /> Demande d'achat
                    </button>
                    <button 
                        className={activeTab === 'consultation' ? 'active' : ''}
                        onClick={() => setActiveTab('consultation')}
                    >
                        <FaClipboardList /> Consultation
                    </button>
                    <button 
                        className={activeTab === 'commande' ? 'active' : ''}
                        onClick={() => setActiveTab('commande')}
                    >
                        <FaListOl /> Bon de commande
                    </button>
                    {dossier.etapes && dossier.etapes.length > 0 && (
                        <button 
                            className={activeTab === 'etapes' ? 'active' : ''}
                            onClick={() => setActiveTab('etapes')}
                        >
                            <FaFolderOpen /> Étapes
                        </button>
                    )}
                </div>

                <div className="dossier-details-content">
                    {(activeTab === 'general') && (
                        <div className="details-section active">
                            <h2><FaFileAlt /> Informations générales</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaTag />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Objet:</span>
                                        <span className="detail-value">{dossier.objet}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaBuilding />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Service concerné:</span>
                                        <span className="detail-value">{dossier.service_concerne}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaUser />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Demandeur:</span>
                                        <span className="detail-value">{dossier.demandeur}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Date création:</span>
                                        <span className="detail-value">{formatDate(dossier.date_creation)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaFileAlt />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Référence:</span>
                                        <span className="detail-value">{dossier.reference || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'demande') && (
                        <div className="details-section active">
                            <h2><FaMoneyBillWave /> Demande d'achat</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaListOl />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">N° Demande d'achat:</span>
                                        <span className="detail-value">{dossier.numero_demande_achat || "-"}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Date demande d'achat:</span>
                                        <span className="detail-value">{formatDate(dossier.date_demande_achat)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Prix estimatif:</span>
                                        <span className="detail-value highlight">{formatCurrency(dossier.prix_estimatif)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'consultation') && (
                        <div className="details-section active">
                            <h2><FaClipboardList /> Consultation</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaListOl />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">N° Consultation:</span>
                                        <span className="detail-value">{dossier.numero_consultation || "-"}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Date consultation:</span>
                                        <span className="detail-value">{formatDate(dossier.date_consultation)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaListOl />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">N° Appel d'offre:</span>
                                        <span className="detail-value">{dossier.numero_appel_offre || "-"}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Date appel d'offre:</span>
                                        <span className="detail-value">{formatDate(dossier.date_appel_offre)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Date dépouillement:</span>
                                        <span className="detail-value">{formatDate(dossier.date_depouillement)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'commande') && (
                        <div className="details-section active">
                            <h2><FaListOl /> Bon de commande</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaListOl />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">N° Bon de commande:</span>
                                        <span className="detail-value">{dossier.numero_bon_commande || "-"}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Date bon de commande:</span>
                                        <span className="detail-value">{formatDate(dossier.date_bon_commande)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Montant:</span>
                                        <span className="detail-value highlight">{formatCurrency(dossier.montant)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <FaTruckLoading />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Date livraison:</span>
                                        <span className="detail-value">{formatDate(dossier.date_livraison)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'etapes' && dossier.etapes && dossier.etapes.length > 0) && (
                        <div className="details-section active">
                            <h2><FaFolderOpen /> Étapes du dossier</h2>
                            <div className="etapes-timeline">
                                {dossier.etapes.map((etape, index) => (
                                    <div key={index} className="etape-item">
                                        <div className="etape-marker">
                                            <div className="etape-number">{index + 1}</div>
                                        </div>
                                        <div className="etape-content">
                                            <p>{etape}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DossierDetails;