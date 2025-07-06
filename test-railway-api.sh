#!/bin/bash

# Script de test de l'API Railway
# Remplacez cette URL par votre vraie URL Railway
API_URL="https://kempo-backend-production.up.railway.app"

echo "🧪 Test de l'API Railway: $API_URL"
echo "=" | tr '=' '-'
echo

# Test 1: Health check (endpoint de base)
echo "1️⃣ Test de base - Status de l'API:"
curl -v "$API_URL" 2>/dev/null | head -10
echo -e "\n"

# Test 2: Documentation API
echo "2️⃣ Test documentation API:"
curl -I "$API_URL/docs" 2>/dev/null | head -5
echo -e "\n"

# Test 3: Endpoint public (sans token)
echo "3️⃣ Test endpoint tournois (sans auth):"
curl -X GET "$API_URL/api/tournaments" \
  -H "Content-Type: application/json" \
  2>/dev/null | jq . 2>/dev/null || echo "Réponse reçue (pas de JSON formatter installé)"
echo -e "\n"

# Test 4: Endpoint ranks
echo "4️⃣ Test endpoint ranks:"
curl -X GET "$API_URL/api/ranks" \
  -H "Content-Type: application/json" \
  2>/dev/null | jq . 2>/dev/null || echo "Réponse reçue"
echo -e "\n"

echo "✅ Tests terminés!"
echo "💡 Si vous voyez des réponses JSON, votre API fonctionne !"
echo "⚠️  Si vous voyez des erreurs de connexion, vérifiez l'URL Railway"
