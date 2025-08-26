import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import "./Home.css";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#6b7280"];

const Home = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/stats/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <h1>📊 Tableau de Bord</h1>
        <p>Vue d’ensemble des utilisateurs et dossiers</p>
      </div>

      {/* Indicateurs clés */}
      <div className="kpi-section">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#2563eb", color: "white" }}>👥</div>
          <div className="kpi-content">
            <h3>{stats.totalUsers}</h3>
            <p>Utilisateurs</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#10b981", color: "white" }}>📂</div>
          <div className="kpi-content">
            <h3>{stats.totalDossiers}</h3>
            <p>Dossiers</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#f59e0b", color: "white" }}>✅</div>
          <div className="kpi-content">
            <h3>{stats.dossiersValides}</h3>
            <p>Validés</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#ef4444", color: "white" }}>⏳</div>
          <div className="kpi-content">
            <h3>{stats.dossiersEnCours}</h3>
            <p>En cours</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-section">
        {/* Pie chart par statut */}
        <div className="chart-card">
          <h2>Répartition des dossiers par statut</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.dossiersParStatut}
                dataKey="value"
                nameKey="statut"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {stats.dossiersParStatut.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart par mois */}
        <div className="chart-card">
          <h2>Dossiers créés par mois</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.dossiersParMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nombre" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart : users par matricule */}
        <div className="chart-card">
          <h2>Utilisateurs par matricule</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.usersParMatricule}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="matricule" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
        {/* Bar chart : dossiers par année */}
        <div className="chart-card">
          <h2>Dossiers créés par année</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.dossiersParAnnee}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="annee" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Derniers utilisateurs */}
      <div className="bottom-section">
        <div className="table-card">
          <div className="card-header">
            <h2>👤 Derniers utilisateurs inscrits</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Matricule</th>
                  <th>Rôle</th>
                </tr>
              </thead>
              <tbody>
                {stats.dernierUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.nom} {user.prenom}</td>
                    <td>{user.email}</td>
                    <td>{user.matricule}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
