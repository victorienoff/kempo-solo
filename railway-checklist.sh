#!/bin/bash

echo "🚀 CHECKLIST - Vérification API Railway"
echo "========================================="
echo

echo "☐ 1. Obtenir l'URL Railway"
echo "   → Aller sur railway.app → votre projet → service backend → Settings → Domains"
echo "   → Noter l'URL (ex: https://kempo-backend-production.up.railway.app)"
echo

echo "☐ 2. Vérifier que Railway build et démarre"
echo "   → Onglet 'Deployments' → voir le dernier deploy"
echo "   → Status doit être 'Success' et 'Active'"
echo

echo "☐ 3. Vérifier les logs Railway"
echo "   → Onglet 'Logs' → chercher ces messages :"
echo "   ✅ '🔗 Initializing database connection...'"
echo "   ✅ '🚀 Server is running on...'"
echo "   ✅ '📚 API documentation is available...'"
echo "   ❌ Erreurs de connexion MySQL"
echo

echo "☐ 4. Tester l'API avec curl"
echo "   → Remplacer URL dans test-railway-api.sh"
echo "   → Exécuter: ./test-railway-api.sh"
echo

echo "☐ 5. Tester dans le navigateur"
echo "   → https://votre-url-railway.up.railway.app/api/tournaments"
echo "   → Doit afficher du JSON, pas d'erreur"
echo

echo "☐ 6. Tester avec le frontend"
echo "   → Modifier temporairement project/src/config/api.js"
echo "   → npm start et vérifier les requêtes"
echo

echo "✨ Si tout fonctionne → votre API Railway est prête !"
echo "🔥 Prochaine étape → configurer Cloudflare Pages avec REACT_APP_API_URL"
