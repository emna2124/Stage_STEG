import React from "react";
import "./Home.css";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Acceuil() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Bienvenue <br /> Société tunisienne de l'électricité et du gaz<span className="dot">.</span>
          </h1>
          <p>
            La Société tunisienne de l'électricité et du gaz (الشركة التونسية للكهرباء و الغاز) ou STEG est une société tunisienne de droit public à caractère non administratif. Créée en 1962, elle a pour mission la production et la distribution de l'électricité et du gaz naturel sur le territoire tunisien.
          </p>
        </div>

        <div className="hero-cards">
          <div className="card">
            <img src={img1} alt="img1" />
          </div>
          <div className="card">
            <img src={img2} alt="img2" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h3>Contactez-nous</h3>
        <p>https://www.steg.com.tn</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/steg.tunisie?fref=ts" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://www.youtube.com/channel/UCzlkr6sWAB9RKm-KSRjq9vQ" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="https://www.linkedin.com/company/steg-tunisie/" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
          <a href="https://x.com/STEG_Tunisie" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://www.instagram.com/stegtunisie/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
      </footer>
    </div>
  );
}
