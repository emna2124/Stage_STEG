import React, { useEffect, useState } from "react";
import "./user.css";

export const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vérifie que le token existe
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/afficher", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des utilisateurs");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erreur de récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
  try {
    const token = localStorage.getItem("token"); // Récupérer le token

    const response = await fetch(`http://localhost:3001/api/users/role/${userId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // <-- Ici, dans les headers
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du rôle");
    }

    const updatedUser = await response.json();

    // Met à jour la liste localement
    setUsers(prev =>
      prev.map(user => (user._id === userId ? updatedUser.user : user))
    );
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="container">
      <h2 className="text-center">Liste des Utilisateurs</h2>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="user-grid">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="user-card">
                <h3>{user.nom} {user.prenom}</h3>
                <p className="user-info">Email: {user.email}</p>
                <p className="user-info">Rôle Actuel : {user.role}</p>

                <div className="role-selection">
                  <label>Rôle</label>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VALIDEUR">Valideur</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun utilisateur trouvé</p>
          )}
        </div>
      )}
    </div>
  );
};
