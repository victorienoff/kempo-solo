# 🚀 Configuration Cloudflare Pages pour Railway API

## ⚡ Étapes pour connecter Cloudflare Pages à Railway

### 1. **Configurer les variables d'environnement**
1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Pages** → **Votre projet kempo-solo**
3. **Settings** → **Environment variables**
4. **Production** → **Add variable** :
   ```
   Variable name: VITE_API_URL
   Value: https://kempo-solo-production.up.railway.app
   ```
5. **Save**

### 2. **Redéployer le site**
1. **Deployments** → Cliquez sur le dernier déploiement
2. **View details** → **Retry deployment**
3. Ou pushez un nouveau commit sur la branche principale

### 3. **Vérifier le déploiement**
Une fois redéployé, votre site devrait :
- ✅ Se connecter à l'API Railway
- ✅ Afficher les données des tournois
- ✅ Permettre la connexion/inscription
- ❌ Plus afficher "en cours de développement"

### 4. **Debug si problème**
Si le site ne fonctionne toujours pas :
1. **Logs Cloudflare** : Pages → Deployments → View details
2. **Console navigateur** : F12 → Console pour voir les erreurs
3. **Network** : F12 → Network pour voir les requêtes API

## 🔧 Configuration locale vs production

### **Développement local** (.env)
```
VITE_API_URL=http://localhost:3000
```

### **Production Cloudflare** (via dashboard)
```
VITE_API_URL=https://kempo-solo-production.up.railway.app
```

Le code s'adapte automatiquement selon l'environnement !
