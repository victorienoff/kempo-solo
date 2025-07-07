#!/bin/bash

echo "🔧 Building React app for Cloudflare Pages..."

# Export des variables d'environnement pour production
export SKIP_PREFLIGHT_CHECK=true
export GENERATE_SOURCEMAP=false
export NODE_OPTIONS="--openssl-legacy-provider"
export VITE_API_URL="https://kempo-solo-production.up.railway.app"

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --force --silent

echo "🏗️ Building application with Vite..."

# Build principal avec Vite
npm run build:vite

# Vérifier que le build a réussi
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✅ Vite build successful!"
    
    echo "📁 Build directory created successfully"
    ls -la build/
    
    # Vérifier que le build contient bien les assets Vite
    if [ -d "build/assets" ]; then
        echo "✅ Assets directory found in build"
        echo "📄 Build contents:"
        ls -la build/assets/ | head -5
    else
        echo "⚠️ No assets directory found"
    fi
    
    echo "✅ Build process completed successfully!"
else
    echo "❌ Vite build failed!"
    exit 1
fi
