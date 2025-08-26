import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaFolderOpen, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "./Navigation.css";
import DossierList from "./DossierList";
import logo from "../assets/logoS.png";
import Home from "../dashboard/Home";
import Acceuil from "./Acceuil";

export const NavigationAgent = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");

    if (!token || !userInfo) {
      navigate("/");
      return;
    }

    if (userInfo.role !== "Agent") {
      navigate("/");
      return;
    }

    setUserName(userInfo.prenom);
    setUserId(userInfo.id);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleUserClick = (e) => {
    e.preventDefault();
    if (userId) navigate(`/profile/${userId}`);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    // Fermer le menu après sélection sur mobile
    if (window.innerWidth <= 768) {
      setIsNavExpanded(false);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "home":
        return <Acceuil />;
      case "dossiers":
        return <DossierList agentId={userId} />;
      default:
        return (
          <div className="content-welcome">
            Bienvenue {userName} ! Sélectionnez une option dans le menu.
          </div>
        );
    }
  };

  return (
    <div className="navigation-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
        <div className="container-fluid">
          {/* Logo */}
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>

          {/* Burger menu mobile */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            aria-label="Toggle navigation"
          >
            {isNavExpanded ? <FaTimes /> : <FaBars />}
          </button>

          {/* Menu principal */}
          <div className={`collapse navbar-collapse ${isNavExpanded ? 'show' : ''}`} id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${selectedMenu === "home" ? "active" : ""}`}
                  onClick={() => handleMenuClick("home")}
                >
                  <FaHome className="me-2" /> Accueil
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${selectedMenu === "dossiers" ? "active" : ""}`}
                  onClick={() => handleMenuClick("dossiers")}
                >
                  <FaFolderOpen className="me-2" /> Dossiers
                </button>
              </li>
            </ul>

            {/* Profil + Déconnexion */}
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-user" onClick={handleUserClick}>
                <FaUserCircle className="me-2" />
                {userName}
              </button>
              <button className="btn btn-logout" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay pour mobile quand le menu est ouvert */}
      {isNavExpanded && (
        <div 
          className="mobile-nav-overlay"
          onClick={() => setIsNavExpanded(false)}
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Contenu principal */}
      <main className="container-fluid main-content">{renderContent()}</main>
    </div>
  );
};