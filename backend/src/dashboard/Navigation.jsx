import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaFolderOpen, FaUsers, FaSignOutAlt, FaBars } from "react-icons/fa";
import { User } from "./user";
import "./Navigation.css"; 
import DossierList from "./DossierList";
import Home from "./Home.jsx";
import logo from "../assets/logoS.png";

export const Navigation = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setUserName(user.prenom || "Utilisateur");
      setUserId(user.id);
    }
    
    // Fermer la sidebar si on redimensionne vers un écran plus large
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "user":
        return <User />;
      case "dossier":
        return <DossierList />;
      case "dashboard":
        return <Home />;
      default:
        return <Home />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    // Fermer la sidebar après sélection sur mobile
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* Bouton hamburger pour mobile */}
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h2>STEG</h2>
        </div>

        {/* Bouton profil */}
        <button
          className={`btn btn-user ${selectedMenu === "profile" ? "active" : ""}`}
          onClick={() => {
            handleMenuClick("profile");
            if (userId) navigate(`/profile/${userId}`);
          }}
        >
          <FaUserCircle className="me-2" />
          <span>{userName}</span>
        </button>

        {/* Menu */}
        <ul>
          <li>
            <button
              className={selectedMenu === "dashboard" ? "active" : ""}
              onClick={() => handleMenuClick("dashboard")}
            >
              <FaHome size={18} /> <span>Tableau de bord</span>
            </button>
          </li>
          <li>
            <button
              className={selectedMenu === "user" ? "active" : ""}
              onClick={() => handleMenuClick("user")}
            >
              <FaUsers size={18} /> <span>Utilisateurs</span>
            </button>
          </li>
          <li>
            <button
              className={selectedMenu === "dossier" ? "active" : ""}
              onClick={() => handleMenuClick("dossier")}
            >
              <FaFolderOpen size={18} /> <span>Dossiers</span>
            </button>
          </li>
          <li>
            <button className="logout-button" onClick={Logout}>
              <FaSignOutAlt size={18} /> <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Overlay pour fermer la sidebar en cliquant à côté (mobile) */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        />
      )}

      {/* Contenu principal */}
      <div className="content">{renderContent()}</div>
    </div>
  );
};