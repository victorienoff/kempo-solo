import React, { useEffect, useState } from "react";
import AuthButtons from "../../components/AuthButtons";
import styles from "./Profile.module.css";
import { apiUrl } from '../../config/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [ranks, setRanks] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);

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
    fetch(apiUrl("/api/competitors/me"), {
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
    fetch(apiUrl("/api/ranks"))
      .then((res) => res.json())
      .then((data) => setRanks(data))
      .catch(() => setRanks([]));

    // Récupération des tournois auxquels je participe
    if (token) {
      fetch(apiUrl("/api/tournaments/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setMyTournaments(data))
        .catch(() => setMyTournaments([]));
    }
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

   const handleValidate = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${apiUrl("/api/competitors/")}${user.id}`, {
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

  const handleUnregister = async (tournamentId) => {
    if (!user || !user.id) {
      alert("Vous devez être connecté pour vous désinscrire.");
      return;
    }
    const confirm = window.confirm("Voulez-vous vraiment vous désinscrire de ce tournoi ?");
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl("/api/tournaments/")}${tournamentId}/delete-competitor/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        alert("Désinscription réussie !");
        // Rafraîchir la liste des tournois
        fetch(apiUrl("/api/tournaments/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => setMyTournaments(data))
          .catch(() => setMyTournaments([]));
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de la désinscription.");
      }
    } catch (error) {
      alert("Erreur réseau lors de la désinscription.");
    }
  };

  if (loading) return <div className={styles.profilePage}><div className={styles.profileCard}>Chargement du profil...</div></div>;
  if (error) return <div className={styles.profilePage}><div className={styles.profileCard}>{error}</div></div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h2 className={styles.profileTitle}>Mon Profil</h2>
        <div className={styles.profileInfoGrid}>
          {!editMode ? (
            <>
              <div><span className={styles.label}>Nom :</span> {user?.lastname || "-"}</div>
              <div><span className={styles.label}>Prénom :</span> {user?.firstname || "-"}</div>
              <div><span className={styles.label}>Date de naissance :</span> {user?.birthday ? new Date(user.birthday).toLocaleDateString() : "-"}</div>
              <div><span className={styles.label}>Club :</span> {user?.club || "-"}</div>
              <div><span className={styles.label}>Pays :</span> {user?.country || "-"}</div>
              <div><span className={styles.label}>Poids :</span> {user?.weight !== undefined ? user.weight + " kg" : "-"}</div>
              <div><span className={styles.label}>Grade :</span> {user?.rank || "-"}</div>
              <div><span className={styles.label}>Sexe :</span> {user?.gender || "-"}</div>
              <div><span className={styles.label}>Email :</span> {user?.email || "-"}</div>
            </>
          ) : (
            <>
              <div><span className={styles.label}>Nom :</span> <input name="lastname" value={formData?.lastname || ""} onChange={handleInputChange} /></div>
              <div><span className={styles.label}>Prénom :</span> <input name="firstname" value={formData?.firstname || ""} onChange={handleInputChange} /></div>
              <div><span className={styles.label}>Date de naissance :</span> <input type="date" name="birthday" value={formData?.birthday ? formData.birthday.slice(0,10) : ""} onChange={handleInputChange} /></div>
              <div><span className={styles.label}>Club :</span> <input name="club" value={formData?.club || ""} onChange={handleInputChange} /></div>
              <div><span className={styles.label}>Pays :</span> 
                <select name="country" value={formData?.country || ""} onChange={handleInputChange}>
                  <option value="">Sélectionner</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div><span className={styles.label}>Poids :</span> <input type="number" name="weight" value={formData?.weight || ""} onChange={handleInputChange} /></div>
              <div><span className={styles.label}>Grade :</span> 
                <select name="rank" value={formData?.rank || ""} onChange={handleInputChange}>
                  <option value="">Sélectionner</option>
                  {ranks.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div><span className={styles.label}>Sexe :</span> 
                <select name="gender" value={formData?.gender || ""} onChange={handleInputChange}>
                  <option value="">Sélectionner</option>
                  <option value="H">H</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div><span className={styles.label}>Email :</span> <input name="email" value={formData?.email || ""} onChange={handleInputChange} /></div>
            </>
          )}
        </div>
        <div className={styles.buttonContainer}>
          {editMode ? (
            <button onClick={handleValidate} className={styles.editButton}>Valider</button>
          ) : (
            <button onClick={handleEditClick} className={styles.editButton}>Modifier</button>
          )}
        </div>
        {myTournaments && myTournaments.length > 0 && (
          <div className={styles.tournamentsSection}>
            <h3>Mes tournois</h3>
            <table className={styles.tournamentsTable}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myTournaments.map((t) => {
                  // Vérifier si le tournoi est passé
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const tournoiDate = t.start_date ? new Date(t.start_date) : null;
                  const isFutureOrToday = tournoiDate && tournoiDate >= today;
                  return (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{
                        t.start_date && !isNaN(Date.parse(t.date))
                          ? new Date(t.start_date).toLocaleDateString()
                          : (t.start_date?.split("T")[0] || '-')
                      }</td>
                      <td>{t.city || '-'}</td>
                      <td>
                        {isFutureOrToday && (
                          <button
                            className="register-btn-red"
                            style={{background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', cursor: 'pointer'}}
                            onClick={() => handleUnregister(t.id)}
                          >
                            Se désinscrire
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
