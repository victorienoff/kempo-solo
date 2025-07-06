# 🚂 Déploiement Kempo Solo Backend sur Railway

## ⚡ Guide de déploiement rapide

### 1. Prérequis
- Compte GitHub avec ce repository
- Compte Railway (gratuit) : https://railway.app

### 2. Déploiement sur Railway

1. **Créer un compte Railway** et se connecter avec GitHub
2. **Nouveau projet** → **Deploy from GitHub repo**
3. **Sélectionner** ce repository
4. **⚠️ IMPORTANT - Ajouter une base de données MySQL** :
   - Dans le dashboard Railway
   - Cliquer sur "New" → "Database" → "Add MySQL"
   - Railway génère automatiquement la variable `MYSQL_URL`
5. **Configurer les variables d'environnement** :
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=https://kempo-solo.pages.dev
   ```
6. **Déployer** ! Railway détecte automatiquement le Dockerfile

### 3. Configuration automatique

Railway configure automatiquement :
- ✅ Variables de base de données MySQL (`MYSQL_URL`)
- ✅ Port d'écoute ($PORT)
- ✅ SSL/HTTPS automatique
- ✅ Build et déploiement depuis GitHub

### 4. Migrations

Après le premier déploiement :
```bash
# Railway CLI (optionnel)
railway run pnpm migrate

# Ou via le dashboard Railway > Variables > Add Command
# Startup Command: pnpm migrate && pnpm start
```

### 5. URL de l'API

Après déploiement, votre API sera disponible sur :
```
https://your-app-name-production.up.railway.app
```

### 6. Obtenir l'URL et tester l'API

#### 📍 **Récupérer l'URL Railway :**
1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur votre projet
3. Cliquez sur le service **backend**
4. Onglet **"Settings"** → **"Domains"**
5. Notez l'URL générée (ex: `https://kempo-backend-production.up.railway.app`)

#### 🧪 **Tester l'API :**

**Dans le navigateur :**
```
https://votre-url-railway.up.railway.app/api/tournaments
https://votre-url-railway.up.railway.app/api/ranks
https://votre-url-railway.up.railway.app/docs
```

**Avec curl :**
```bash
# Test de base
curl https://votre-url-railway.up.railway.app/api/tournaments

# Test avec authentification (si vous avez un token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://votre-url-railway.up.railway.app/api/competitors
```

**Réponses attendues :**
- ✅ JSON avec données → API fonctionne !
- ❌ Erreur 500/ECONNREFUSED → Problème de base de données
- ❌ "Cannot GET" → Problème de routing

#### 🔍 **Debugger les problèmes :**
1. **Logs Railway** : Dashboard → Service backend → "Logs"
2. **Variables d'environnement** : Vérifier que `MYSQL_URL` est définie
3. **Base de données** : S'assurer que MySQL est connecté au service

### 7. Connecter le frontend à l'API Railway

Une fois l'API testée et fonctionnelle :

#### **Pour Cloudflare Pages :**
1. Allez dans votre projet Cloudflare Pages
2. **Settings** → **Environment variables**
3. Ajoutez : `REACT_APP_API_URL = https://votre-url-railway.up.railway.app`
4. Redéployez le frontend

#### **Pour test local :**
```bash
# Dans project/.env
REACT_APP_API_URL=https://votre-url-railway.up.railway.app

# Puis
cd project
npm start
```

Le frontend utilisera automatiquement l'API Railway au lieu de localhost !

## 🛠️ Développement local

```bash
# Installation
cd backend
pnpm install

# Variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Démarrage
pnpm dev
```

## 📋 Stack technique

- **Runtime** : Node.js 22 avec TypeScript strip-types
- **Framework** : Hono
- **ORM** : MikroORM
- **Base de données** : PostgreSQL (production) / MySQL (local)
- **Package manager** : pnpm
- **Déploiement** : Railway

## 🔄 CI/CD

Chaque push sur la branche `main` redéploie automatiquement l'application.

## 🐛 Debug

Logs en temps réel disponibles dans le dashboard Railway.
