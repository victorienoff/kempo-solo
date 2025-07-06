# Configuration Frontend → Backend

## 🔗 Connexion API Railway

### 1. **Obtenir l'URL Railway**
- Allez dans votre projet Railway
- Cliquez sur votre service backend 
- Dans l'onglet "Settings" → "Domains"
- Notez l'URL (ex: `https://kempo-backend-production.up.railway.app`)

### 2. **Configurer Cloudflare Pages**
Dans l'interface Cloudflare Pages, ajoutez cette variable d'environnement :
```
REACT_APP_API_URL=https://votre-app-railway.up.railway.app
```

### 3. **Variables d'environnement**

#### Développement local (.env)
```
REACT_APP_API_URL=http://localhost:3000
```

#### Production Cloudflare (.env.production)
```
REACT_APP_API_URL=https://votre-app-railway.up.railway.app
```

### 4. **Test local**
```bash
# Démarrer le backend (port 3000)
cd backend && pnpm dev

# Démarrer le frontend (port 5173)
cd project && npm start
```

### 5. **Déploiement**
```bash
# Build et déploiement sur Cloudflare Pages
cd project && npm run build
```

## 🔧 Configuration API

Le fichier `src/config/api.js` gère automatiquement :
- ✅ URL locale pour le développement 
- ✅ URL Railway pour la production
- ✅ Headers d'authentification
- ✅ Gestion des erreurs

## 📁 Fichiers modifiés

Les composants suivants utilisent maintenant la configuration API :
- ✅ CompetitorsTable.jsx
- ✅ AddCompetitors.jsx  
- 🔄 EditCompetitors.jsx (à faire)
- 🔄 Signup.jsx (à faire)
- 🔄 Telecommande.jsx (à faire)

## 🚀 Prochaines étapes

1. **Remplacer l'URL Railway** dans `.env.production`
2. **Configurer Cloudflare Pages** avec `REACT_APP_API_URL` 
3. **Tester la connexion** frontend ↔ backend
4. **Finaliser les composants restants**
