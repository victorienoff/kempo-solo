#!/bin/bash

# Installer NVM si nécessaire
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

# Utiliser Node.js 18 (plus compatible avec react-scripts 5.0.1)
nvm use 18 || (nvm install 18 && nvm use 18)

# Build avec Node.js 18
npm install --legacy-peer-deps
NODE_OPTIONS='--openssl-legacy-provider' npm run build
