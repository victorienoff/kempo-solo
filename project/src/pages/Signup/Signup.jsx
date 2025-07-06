import React, { useState, useEffect } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";
import AuthButtons from "../../components/AuthButtons";

const countries = [
  "France", "Belgique", "Suisse", "Canada", "Luxembourg", "Algérie", "Maroc", "Tunisie", "Espagne", "Italie", "Allemagne", "Royaume-Uni", "États-Unis", "Portugal", "Pays-Bas", "Chine", "Japon", "Brésil", "Argentine", "Australie", "Inde", "Russie", "Turquie", "Grèce", "Pologne", "Suède", "Norvège", "Danemark", "Finlande", "Islande", "Irlande", "Autriche", "Hongrie", "Roumanie", "Bulgarie", "Croatie", "Serbie", "Slovaquie", "Slovénie", "Tchéquie", "Ukraine", "Lituanie", "Lettonie", "Estonie", "Chypre", "Malte", "Israël", "Égypte", "Afrique du Sud", "Mexique", "Colombie", "Chili", "Pérou", "Venezuela", "Corée du Sud", "Thaïlande", "Vietnam", "Indonésie", "Malaisie", "Singapour", "Nouvelle-Zélande", "Philippines", "Arabie Saoudite", "Émirats Arabes Unis", "Qatar", "Koweït", "Liban", "Pakistan", "Bangladesh", "Sri Lanka", "Cambodge", "Laos", "Birmanie", "Mongolie", "Kazakhstan", "Ouzbékistan", "Turkménistan", "Géorgie", "Arménie", "Azerbaïdjan", "Irak", "Iran", "Syrie", "Jordanie", "Yémen", "Oman", "Bahreïn", "Koweït", "Afghanistan", "Tadjikistan", "Kirghizistan", "Palestine", "Soudan", "Éthiopie", "Kenya", "Tanzanie", "Ouganda", "Rwanda", "Burundi", "Mozambique", "Angola", "Zimbabwe", "Botswana", "Namibie", "Zambie", "Ghana", "Nigéria", "Cameroun", "Sénégal", "Mali", "Burkina Faso", "Niger", "Tchad", "Côte d'Ivoire", "Guinée", "Bénin", "Togo", "Sierra Leone", "Libéria", "Gambie", "Cap-Vert", "Mauritanie", "Guinée-Bissau", "Congo", "RDC", "Gabon", "Congo-Brazzaville", "Centrafrique", "Guinée équatoriale", "Sao Tomé-et-Principe", "Madagascar", "Comores", "Seychelles", "Maurice", "Swaziland", "Lesotho", "Libye", "Maroc", "Algérie", "Tunisie", "Soudan du Sud"
];

function Signup() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    club: "",
    country: "",
    weight: "",
    rank: "",
    gender: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [ranks, setRanks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/ranks")
      .then((res) => res.json())
      .then((data) => setRanks(data))
      .catch(() => setRanks([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de l'inscription");
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError("Inscription réussie mais aucun token reçu.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <AuthButtons />
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} className={styles.form} style={{display:'flex', flexDirection:'column', gap:16, background:'#fff', color:'#222'}}>
        <label>Prénom<input name="firstname" placeholder="Prénom" value={form.firstname} onChange={handleChange} required /></label>
        <label>Nom<input name="lastname" placeholder="Nom" value={form.lastname} onChange={handleChange} required /></label>
        <label>Date de naissance<input name="birthday" type="date" placeholder="Date de naissance" value={form.birthday} onChange={handleChange} required /></label>
        <label>Club<input name="club" placeholder="Club" value={form.club} onChange={handleChange} /></label>
        <label>Pays
          <select name="country" value={form.country} onChange={handleChange} required>
            <option value="">Pays</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>Poids (kg)<input name="weight" type="number" placeholder="Poids (kg)" value={form.weight} onChange={handleChange} /></label>
        <label>Grade
          <select name="rank" value={form.rank} onChange={handleChange} required>
            <option value="">Grade</option>
            {ranks.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>Sexe
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Sexe</option>
            <option value="H">H</option>
            <option value="F">F</option>
          </select>
        </label>
        <label>Email<input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /></label>
        <label>Mot de passe<input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required /></label>
        <label>Confirmation du mot de passe<input name="confirmPassword" type="password" placeholder="Confirmez le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></label>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.btn}>S'inscrire</button>
      </form>
    </div>
  );
}

export default Signup;
