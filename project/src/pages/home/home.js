import React from "react";

const Home = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Règles du Kempo</h1>
    <ul>
      <li>Respect de l’adversaire et des arbitres en toute circonstance.</li>
      <li>Les combats se déroulent en plusieurs rounds selon la catégorie.</li>
      <li>Les techniques autorisées : coups de poing, coups de pied, projections, immobilisations.</li>
      <li>Les frappes au visage, à la gorge, à l’aine et aux articulations sont interdites.</li>
      <li>Le port du protège-dents, des gants et du casque est obligatoire.</li>
      <li>Un point est accordé pour chaque technique correcte portée dans la zone autorisée.</li>
      <li>Le non-respect des règles entraîne des avertissements, puis la disqualification.</li>
      <li>La décision de l’arbitre est sans appel.</li>
    </ul>
  </div>
);

export default Home;