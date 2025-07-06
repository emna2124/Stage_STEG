import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./login.css";

function Signup() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3001/api/users/register", {
      nom,
      prenom,
      email,
      password,
    })
      .then(result => {
        console.log(result);
        navigate("/login");
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 text-primary" style={{ fontSize: "2rem" }}>
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="nom" className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              id="nom"
              placeholder="Entrez votre nom"
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="prenom" className="form-label">Prénom</label>
            <input
              type="text"
              className="form-control"
              id="prenom"
              placeholder="Entrez votre prénom"
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Entrez votre email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Entrez votre mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Sign Up
          </button>
        </form>

        <div className="text-center">
          <p className="mb-1">Déjà inscrit ?</p>
          <Link to="/login" className="btn btn-outline-secondary w-100">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
