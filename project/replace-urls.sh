#!/bin/bash

# Script pour remplacer toutes les URLs localhost par la configuration API

echo "🔄 Replacing hardcoded localhost URLs with API config..."

# Find all .js and .jsx files in src/
find ./src -name "*.js" -o -name "*.jsx" | while read file; do
    # Check if file contains localhost:3000
    if grep -q "localhost:3000" "$file"; then
        echo "📝 Processing: $file"
        
        # Add import for API_CONFIG if not already present
        if ! grep -q "import.*API_CONFIG.*from.*config/api" "$file"; then
            # Find the line number of the last import
            last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
            if [ ! -z "$last_import_line" ]; then
                # Add API_CONFIG import after the last import
                sed -i "${last_import_line}a import { API_CONFIG, apiUrl } from '../../../config/api';" "$file"
            fi
        fi
        
        # Replace common patterns
        sed -i 's|"http://localhost:3000/api/competitors"|API_CONFIG.ENDPOINTS.COMPETITORS|g' "$file"
        sed -i 's|`http://localhost:3000/api/competitors/${|\`${API_CONFIG.ENDPOINTS.COMPETITORS}/|g' "$file"
        sed -i 's|"http://localhost:3000/api/ranks"|API_CONFIG.ENDPOINTS.RANKS|g' "$file"
        sed -i 's|"http://localhost:3000/api/tournaments"|API_CONFIG.ENDPOINTS.TOURNAMENTS|g' "$file"
        sed -i 's|"http://localhost:3000/api/matches"|API_CONFIG.ENDPOINTS.MATCHES|g' "$file"
        sed -i 's|`http://localhost:3000/api/matches/${|\`${API_CONFIG.ENDPOINTS.MATCHES}/|g' "$file"
        
        # For any remaining localhost URLs, replace with apiUrl helper
        sed -i 's|"http://localhost:3000\([^"]*\)"|apiUrl("\1")|g' "$file"
        sed -i 's|`http://localhost:3000\([^`]*\)`|apiUrl(`\1`)|g' "$file"
    fi
done

echo "✅ URL replacement completed!"
