# Test rapide de l'API Railway depuis le frontend

## 1. Modifier temporairement l'URL API locale
# Dans project/src/config/api.js, remplacez temporairement :

const API_BASE_URL = "https://votre-app-railway.up.railway.app" // Votre vraie URL Railway

## 2. Démarrer le frontend
cd project
npm start

## 3. Aller sur http://localhost:5173
# Essayez de :
# - Voir la liste des tournois
# - Créer un compte  
# - Se connecter
# - Voir les compétiteurs

## 4. Vérifier les logs dans la console browser (F12)
# Vous devriez voir :
🔗 API Configuration: {
  BASE_URL: "https://votre-app-railway.up.railway.app",
  NODE_ENV: "development",
  REACT_APP_API_URL: null
}

## 5. Remettre l'URL locale après test
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://votre-app-railway.up.railway.app'
    : 'http://localhost:3000'
  );
