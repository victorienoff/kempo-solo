import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [ranks, setRanks] = useState([]);

  const countries = [
    "France", "Belgique", "Suisse", "Canada", "Luxembourg", "Algérie", "Maroc", "Tunisie", "Espagne", "Italie", "Allemagne", "Royaume-Uni", "États-Unis", "Portugal", "Pays-Bas", "Chine", "Japon", "Brésil", "Argentine", "Australie", "Inde", "Russie", "Turquie", "Grèce", "Pologne", "Suède", "Norvège", "Danemark", "Finlande", "Islande", "Irlande", "Autriche", "Hongrie", "Roumanie", "Bulgarie", "Croatie", "Serbie", "Slovaquie", "Slovénie", "Tchéquie", "Ukraine", "Lituanie", "Lettonie", "Estonie", "Chypre", "Malte", "Israël", "Égypte", "Afrique du Sud", "Mexique", "Colombie", "Chili", "Pérou", "Venezuela", "Corée du Sud", "Thaïlande", "Vietnam", "Indonésie", "Malaisie", "Singapour", "Nouvelle-Zélande", "Philippines", "Arabie Saoudite", "Émirats Arabes Unis", "Qatar", "Koweït", "Liban", "Pakistan", "Bangladesh", "Sri Lanka", "Cambodge", "Laos", "Birmanie", "Mongolie", "Kazakhstan", "Ouzbékistan", "Turkménistan", "Géorgie", "Arménie", "Azerbaïdjan", "Irak", "Iran", "Syrie", "Jordanie", "Yémen", "Oman", "Bahreïn", "Koweït", "Afghanistan", "Tadjikistan", "Kirghizistan", "Palestine", "Soudan", "Éthiopie", "Kenya", "Tanzanie", "Ouganda", "Rwanda", "Burundi", "Mozambique", "Angola", "Zimbabwe", "Botswana", "Namibie", "Zambie", "Ghana", "Nigéria", "Cameroun", "Sénégal", "Mali", "Burkina Faso", "Niger", "Tchad", "Côte d'Ivoire", "Guinée", "Bénin", "Togo", "Sierra Leone", "Libéria", "Gambie", "Cap-Vert", "Mauritanie", "Guinée-Bissau", "Congo", "RDC", "Gabon", "Congo-Brazzaville", "Centrafrique", "Guinée équatoriale", "Sao Tomé-et-Principe", "Madagascar", "Comores", "Seychelles", "Maurice", "Swaziland", "Lesotho", "Libye", "Maroc", "Algérie", "Tunisie", "Soudan du Sud"
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }
    fetch("http://localhost:3000/api/competitors/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger le profil utilisateur.");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFormData(data); // Pré-remplir le formulaire en mode édition
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Récupération des ranks
    fetch("http://localhost:3000/ranks")
      .then((res) => res.json())
      .then((data) => setRanks(data))
      .catch(() => setRanks([]));
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleValidate = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/competitors/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      setUser(formData);
      setEditMode(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className={styles.profileContainer}>Chargement du profil...</div>;
  if (error) return <div className={styles.profileContainer}>{error}</div>;

  return (
    <div className={styles.profileContainer}>
      <h2>Mon Profil</h2>
      <div className={styles.profileInfo}>
        {!editMode ? (
          <>
            <div><strong>Nom :</strong> {user?.lastname || "-"}</div>
            <div><strong>Prénom :</strong> {user?.firstname || "-"}</div>
            <div><strong>Date de naissance :</strong> {user?.birthday ? new Date(user.birthday).toLocaleDateString() : "-"}</div>
            <div><strong>Club :</strong> {user?.club || "-"}</div>
            <div><strong>Pays :</strong> {user?.country || "-"}</div>
            <div><strong>Poids :</strong> {user?.weight !== undefined ? user.weight + " kg" : "-"}</div>
            <div><strong>Grade :</strong> {user?.rank || "-"}</div>
            <div><strong>Sexe :</strong> {user?.gender || "-"}</div>
            <div><strong>Email :</strong> {user?.email || "-"}</div>
          </>
        ) : (
          <>
            <div><strong>Nom :</strong> <input name="lastname" value={formData?.lastname || ""} onChange={handleInputChange} /></div>
            <div><strong>Prénom :</strong> <input name="firstname" value={formData?.firstname || ""} onChange={handleInputChange} /></div>
            <div><strong>Date de naissance :</strong> <input type="date" name="birthday" value={formData?.birthday ? formData.birthday.slice(0,10) : ""} onChange={handleInputChange} /></div>
            <div><strong>Club :</strong> <input name="club" value={formData?.club || ""} onChange={handleInputChange} /></div>
            <div><strong>Pays :</strong> 
              <select name="country" value={formData?.country || ""} onChange={handleInputChange}>
                <option value="">Sélectionner</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div><strong>Poids :</strong> <input type="number" name="weight" value={formData?.weight || ""} onChange={handleInputChange} /></div>
            <div><strong>Grade :</strong> 
              <select name="rank" value={formData?.rank || ""} onChange={handleInputChange}>
                <option value="">Sélectionner</option>
                {ranks.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div><strong>Sexe :</strong> 
              <select name="gender" value={formData?.gender || ""} onChange={handleInputChange}>
                <option value="">Sélectionner</option>
                <option value="H">H</option>
                <option value="F">F</option>
              </select>
            </div>
            <div><strong>Email :</strong> <input name="email" value={formData?.email || ""} onChange={handleInputChange} /></div>
          </>
        )}
      </div>
      {editMode ? (
        <div className={styles.buttonContainer}>
          <button onClick={handleValidate} className={styles.editButton}>Valider</button>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <button onClick={handleEditClick} className={styles.editButton}>Modifier</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
