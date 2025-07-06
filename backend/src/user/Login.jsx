import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/api/users/login", { email, password })
      .then((result) => {
        console.log("Réponse du serveur :", result);

        // Si le backend renvoie un token
        if (result.data.accessToken) {
          // Stocker le token dans localStorage
          localStorage.setItem("token", result.data.accessToken);
          localStorage.setItem("userEmail", email);

          // Redirection après connexion
          navigate("/");
        } else {
          alert("Connexion échouée : token manquant.");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la connexion :", err);
        alert("Email ou mot de passe incorrect.");
      });
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2
          className="text-center mb-4 text-primary"
          style={{ fontSize: "2rem" }}
        >
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <div className="text-center">
          <p className="mb-1">Don't have an account?</p>
          <Link to="/register" className="btn btn-outline-secondary w-100">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
