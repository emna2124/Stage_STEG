import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { User } from "./user";
import Dossier from "./Dossier";
import "./Navigation.css"; 

export const Navigation = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserName) setUserName(storedUserName);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const Logout = () => {
    localStorage.removeItem("isLogedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleUserClick = (e) => {
    e.preventDefault();
    if (userId) navigate(`/showProfile/${userId}`);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "user":
        return <User />;
      case "dossier":
        return <Dossier />;
      default:
        return <h1>Bienvenue sur le Dashboard</h1>;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <nav className="sidebar">
        <a href="#" onClick={handleUserClick}>
          <FaUserCircle size={20} style={{ marginRight: "5px" }} /> {userName}
        </a>

        <ul>
          <li><button onClick={() => setSelectedMenu("user")}>User</button></li>
          <li><button onClick={() => setSelectedMenu("dossier")}>Dossier</button></li>
          <li><button className="logout-button" onClick={Logout}>Log out</button></li>
        </ul>
      </nav>

      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};
