#!/bin/bash

echo "🔧 Building React app for Cloudflare Pages..."

# Export des variables d'environnement
export SKIP_PREFLIGHT_CHECK=true
export GENERATE_SOURCEMAP=false
export NODE_OPTIONS="--openssl-legacy-provider"

# Installation des dépendances avec force
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --force --silent

# Build alternatif avec ejection temporaire si nécessaire
echo "🏗️ Building application..."

# Tentative 1: Build normal
npm run build:original || {
    echo "❌ Standard build failed, trying alternative build..."
    
    # Tentative 2: Build avec webpack 4 compatibility
    WEBPACK_CONFIG_PATH=$(find node_modules -name "webpack.config.js" | grep react-scripts)
    if [ -f "$WEBPACK_CONFIG_PATH" ]; then
        echo "🔄 Patching webpack config..."
        # Backup et patch temporaire
        cp "$WEBPACK_CONFIG_PATH" "${WEBPACK_CONFIG_PATH}.bak"
        sed -i 's/new TerserPlugin(/\/\/ new TerserPlugin(/g' "$WEBPACK_CONFIG_PATH" || true
    fi
    
    # Tentative 3: Build sans minification
    BUILD_PATH=build GENERATE_SOURCEMAP=false react-scripts build || {
        echo "❌ All build attempts failed"
        exit 1
    }
}

echo "✅ Build completed successfully!"
