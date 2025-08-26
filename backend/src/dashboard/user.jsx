import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./user.css";

export const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Vous devez être connecté pour accéder à cette page");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/afficher", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.expired) {
          localStorage.removeItem("token");
          throw new Error("Session expirée - Veuillez vous reconnecter");
        }
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      setUsers(data);
      setError(null);
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
      if (error.message.includes("Session expirée")) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expirée");
        navigate("/");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/users/role/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Session expirée - Veuillez vous reconnecter");
        }
        throw new Error(data.message || "Erreur lors de la mise à jour du rôle");
      }

      setUsers(prev =>
        prev.map(user => (user._id === userId ? data.user : user))
      );
      toast.success("Rôle mis à jour avec succès");
    } catch (error) {
      console.error(error);
      setError(error.message);
      toast.error(error.message);
      if (error.message.includes("Session expirée")) {
        navigate("/");
      }
    }
  };

  const handleToggleApprove = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expirée - Veuillez vous reconnecter");
        navigate("/");
        return;
      }

      const newStatus = !currentStatus;

      const response = await fetch(
        `http://localhost:3001/api/users/approve/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ approved: newStatus })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("Session expirée - Veuillez vous reconnecter");
        }
        throw new Error(data.message || "Erreur lors de la modification du statut");
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isApproved: newStatus } : user
        )
      );

      setError(null);
      toast.success(data.message || `Utilisateur ${newStatus ? "approuvé" : "désactivé"} avec succès`);

    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
      toast.error(error.message);
      
      if (error.message.includes("Session expirée")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  if (loading) {
    return <div className="text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        {error.includes("Session expirée") && (
          <button
            onClick={() => navigate("/")}
            className="btn btn-link"
          >
            Se reconnecter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h2 className="text-center">Liste des Utilisateurs</h2>

      <div className="user-grid">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user._id} className="user-card">
              <h3>
                {user.nom} {user.prenom}
              </h3>
              <p className="user-info">Matricule: {user.matricule}</p>
              <p className="user-info">Email: {user.email}</p>
              <p className="user-info">Rôle Actuel: {user.role}</p>
              <p className="user-info">
                Statut: {user.isApproved ? (
                  <span className="text-success">Approuvé</span>
                ) : (
                  <span className="text-warning">En attente</span>
                )}
              </p>

              <div className="role-selection mb-3">
                <label>Rôle</label>
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user._id, e.target.value)}
                  className="role-select"
                >
                  <option value="Agent">Agent</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button
                onClick={() => handleToggleApprove(user._id, user.isApproved)}
                className={`btn w-100 ${user.isApproved ? "btn-warning" : "btn-success"}`}
              >
                {user.isApproved ? "Désactiver" : "Approuver"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun utilisateur trouvé</p>
        )}
      </div>
    </div>
  );
};