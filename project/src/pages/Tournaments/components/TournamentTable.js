import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./TournamentTable.module.css";
import Filters from "./Filters";
import EditTournoiModal from "./EditTournamentModal";
import { jwtDecode } from "jwt-decode";

const TournoiTable = () => {
  const [searchQueryName, setSearchQueryName] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournoi, setSelectedTournoi] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUSerId] = useState(null);
  const [myTournaments, setMyTournaments] = useState([]);

  // Fetch tournaments
  const fetchTournaments = () => {
    const token = localStorage.getItem("token");
    console.log("Token envoyé:", token);
    fetch("http://localhost:3000/api/tournaments", {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or error fetching tournaments");
        }
        return res.json();
      })
      .then((data) => {
        setTournois(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des tournois:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Décoder le token pour obtenir le rôle
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setUSerId(decoded.id);
      } catch (e) {
        setUserRole(null);
      }
    }
    fetchTournaments();
    // Récupérer les tournois auxquels l'utilisateur est inscrit
    if (token) {
      fetch("http://localhost:3000/api/tournaments/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setMyTournaments(data.map(t => t.id)))
        .catch(() => setMyTournaments([]));
    }
  }, []);

  const filteredTournois = tournois.filter((tournoi) => {
    const nameMatch = tournoi.name.toLowerCase().includes(searchQueryName.toLowerCase());
    const startDate = tournoi.start_date ? tournoi.start_date.split("T")[0] : "";
    const afterStart = !selectedStartDate || startDate >= selectedStartDate;
    const beforeEnd = !selectedEndDate || startDate <= selectedEndDate;
    return nameMatch && afterStart && beforeEnd;
  });

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce tournoi ?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:3000/tournaments/${id}`, {
        method: "DELETE",
      });

      if (response.status === 202) {
        console.log("✅ Tournoi supprimé !");
        setTournois(prev => prev.filter(t => t.id !== id));
      } else if (response.status === 404) {
        alert("❌ Tournoi introuvable.");
      } else {
        alert("❌ Une erreur est survenue.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
    }
  };

  const handleRegister = async (tournamentId) => {
    if (!userId) {
      alert("Vous devez être connecté pour vous inscrire.");
      return;
    }
    const confirm = window.confirm("Voulez-vous vraiment vous inscrire à ce tournoi ?");
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/tournaments/${tournamentId}/add-competitor/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        alert("Inscription réussie !");
        window.location.reload();
      } else {
        let message = "Erreur lors de l'inscription.";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          message = data.message || message;
        } else {
          message = await response.text();
        }
        alert(message);
      }
    } catch (error) {
      alert("Erreur réseau lors de l'inscription.");
    }
  };

  const handleUnregister = async (tournamentId) => {
    if (!userId) {
      alert("Vous devez être connecté pour vous désinscrire.");
      return;
    }
    const confirm = window.confirm("Voulez-vous vraiment vous désinscrire de ce tournoi ?");
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/tournaments/${tournamentId}/delete-competitor/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        alert("Désinscription réussie !");
        // Mettre à jour la liste des inscriptions
        fetch("http://localhost:3000/api/tournaments/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => setMyTournaments(data.map(t => t.id)))
          .catch(() => setMyTournaments([]));
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de la désinscription.");
      }
    } catch (error) {
      alert("Erreur réseau lors de la désinscription.");
    }
  };

  return (
    <div className={styles["table-container"]}>
      <Filters
        searchQuery={searchQueryName}
        setSearchQuery={setSearchQueryName}
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
      />

      {loading ? (
        <p>Chargement des tournois...</p>
      ) : (
        <div className={styles.cardsGrid}>
          {filteredTournois.length > 0 ? (
            filteredTournois.map((comp, index) => (
              <div key={index} className={styles.tournamentCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.tournamentName}>{comp.name}</h3>
                  {comp.description && (
                    <div className={styles.tournamentSubtitle}>{comp.description}</div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <div><strong>Date :</strong> {comp.start_date?.split("T")[0]}</div>
                  <div><strong>Ville :</strong> {comp.city || "-"}</div>
                </div>
                <div className={styles.cardActions}>
                  {userRole === "gestionnaire" && (
                    <>
                      <button
                        className={styles["edit-btn"]}
                        onClick={() => {
                          setSelectedTournoi(comp);
                          setEditOpen(true);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className={styles["delete-btn"]}
                        onClick={() => handleDelete(comp.id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                  <Link to={`/tournoiDetails/${comp.id}`}>
                    <button className={styles["details-btn"]}>Voir Détails</button>
                  </Link>
                  {myTournaments.includes(comp.id) ? (
                    <button
                      className={styles["register-btn-red"]}
                      onClick={() => handleUnregister(comp.id)}
                    >
                      Se désinscrire
                    </button>
                  ) : (
                    <button
                      className={styles["register-btn-green"]}
                      onClick={() => handleRegister(comp.id)}
                    >
                      S'inscrire
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{textAlign: 'center', width: '100%'}}>Aucun tournoi trouvé.</div>
          )}
        </div>
      )}

      <EditTournoiModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        tournament={selectedTournoi}
        onUpdate={fetchTournaments}
      />
    </div>
  );
};

export default TournoiTable;
