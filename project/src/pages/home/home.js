import React from "react";

const Home = () => (
  <div style={{ padding: '2rem', maxWidth: 900, margin: 'auto' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Bienvenue sur le Kempo</h1>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
      <img src={process.env.PUBLIC_URL + '/kempo-fight.jpeg'} alt="Kempo" style={{ width: 180, borderRadius: 16, boxShadow: '0 4px 16px #0002' }} />
      <div style={{ flex: 1, minWidth: 260 }}>
        <h2>Qu'est-ce que le Kempo ?</h2>
        <p>
          Le Kempo est un art martial d'origine japonaise, combinant des techniques de percussion (pieds, poings), de projection et de contrôle au sol. Il se distingue par sa richesse technique et son adaptabilité, permettant à chacun de progresser à son rythme.
        </p>
      </div>
    </div>
    <div style={{ marginBottom: '2rem' }}>
      <h2>Historique</h2>
      <p>
        Le Kempo, parfois appelé Kenpo, puise ses racines dans les arts martiaux chinois et japonais. Il a évolué au fil des siècles pour devenir une discipline moderne, axée sur l'efficacité, la défense personnelle et le développement personnel. Aujourd'hui, le Kempo est pratiqué dans le monde entier, aussi bien en loisir qu'en compétition.
      </p>
    </div>
    <div style={{ marginBottom: '2rem' }}>
      <h2>Les valeurs du Kempo</h2>
      <ul>
        <li><b>Respect</b> : envers soi-même, ses partenaires, ses professeurs et les règles.</li>
        <li><b>Maîtrise de soi</b> : gestion des émotions et contrôle de la force.</li>
        <li><b>Persévérance</b> : progresser malgré les difficultés.</li>
        <li><b>Humilité</b> : rester ouvert à l'apprentissage et à la remise en question.</li>
        <li><b>Solidarité</b> : entraide et esprit d'équipe.</li>
      </ul>
    </div>
    <div style={{ marginBottom: '2rem' }}>
      <h2>Règles du Kempo</h2>
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
  </div>
);

export default Home;