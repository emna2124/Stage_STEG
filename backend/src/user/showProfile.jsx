import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import perso from "../assets/perso.jpg";

export const ShowProfile = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchProfile = async () => {
  try {
    // Récupère le token depuis le localStorage
    const token = localStorage.getItem("token");

    const response = await axios.get(`http://localhost:3001/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`  // <- c'est très important
      }
    });

    setFormData(response.data);
  } catch (err) {
    console.error("Erreur lors de la récupération du profil :", err);
    setFormData(null);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container">
      <div className="section-title text-center">
        <h2>Profil</h2>
      </div>
      <div className="row">
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : formData ? (
          <div className="col-md-4 mx-auto">
            <div className="testimonial">
              <div className="testimonial-image">
                <img src={perso} alt="perso" className="img-fluid rounded-circle" />
              </div>
              <div className="testimonial-content">
                <h4>
                  {formData.nom} {formData.prenom}
                </h4>
                <p>Email: {formData.email || "Non renseigné"}</p>
                <p>Rôle: {formData.role || "Non défini"}</p>
                <p>Matricule: {formData.matricule || "Non défini"}</p>
                
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Aucun profil trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ShowProfile;
