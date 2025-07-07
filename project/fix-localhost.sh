#!/bin/bash

echo "🔄 Remplacement automatique des URLs localhost..."

# Fonction pour ajouter l'import apiUrl si nécessaire
add_import_if_needed() {
    local file="$1"
    
    # Vérifier si apiUrl est déjà importé
    if ! grep -q "apiUrl" "$file"; then
        # Vérifier si API_CONFIG est déjà importé
        if grep -q "API_CONFIG.*from.*config/api" "$file"; then
            # Remplacer l'import existant pour ajouter apiUrl
            sed -i 's/import { API_CONFIG }/import { API_CONFIG, apiUrl }/g' "$file"
        else
            # Trouver la dernière ligne d'import et ajouter le nouvel import
            last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
            if [ ! -z "$last_import_line" ]; then
                # Compter le nombre de ../ nécessaires depuis le fichier vers config/
                depth=$(echo "$file" | sed 's|src/||' | tr -cd '/' | wc -c)
                prefix=""
                for ((i=0; i<depth; i++)); do
                    prefix="../$prefix"
                done
                
                sed -i "${last_import_line}a import { apiUrl } from '${prefix}config/api';" "$file"
            fi
        fi
    fi
}

# Traiter tous les fichiers .jsx trouvés par grep
echo "📝 Traitement des fichiers avec localhost:3000..."

find ./src -name "*.jsx" -exec grep -l "localhost:3000" {} \; | while read file; do
    echo "   → $file"
    
    # Ajouter l'import si nécessaire
    add_import_if_needed "$file"
    
    # Remplacer les patterns courants
    sed -i 's|"http://localhost:3000/register"|apiUrl("/register")|g' "$file"
    sed -i 's|"http://localhost:3000/login"|apiUrl("/login")|g' "$file"
    sed -i 's|`http://localhost:3000/send/${|apiUrl(`/send/${|g' "$file"
    sed -i 's|"http://localhost:3000/api/competitors/me"|apiUrl("/api/competitors/me")|g' "$file"
    sed -i 's|"http://localhost:3000/api/ranks"|apiUrl("/api/ranks")|g' "$file"
    sed -i 's|"http://localhost:3000/api/tournaments/me"|apiUrl("/api/tournaments/me")|g' "$file"
    sed -i 's|`http://localhost:3000/api/competitors/${|\`${apiUrl("/api/competitors/")}${|g' "$file"
    sed -i 's|`http://localhost:3000/api/tournaments/${|\`${apiUrl("/api/tournaments/")}${|g' "$file"
    sed -i 's|`http://localhost:3000/api/matches/${|\`${apiUrl("/api/matches/")}${|g' "$file"
    sed -i 's|`http://localhost:3000/api/age-groups/${|\`${apiUrl("/api/age-groups/")}${|g' "$file"
    sed -i 's|`http://localhost:3000/api/password-reset/${|\`${apiUrl("/api/password-reset/")}${|g' "$file"
    sed -i 's|"http://localhost:3000/tournaments"|apiUrl("/tournaments")|g' "$file"
    
    # Pour les patterns plus complexes, utiliser une approche plus générale
    sed -i 's|"http://localhost:3000\([^"]*\)"|apiUrl("\1")|g' "$file"
    sed -i 's|`http://localhost:3000\([^`]*\)`|apiUrl(`\1`)|g' "$file"
done

echo "✅ Remplacement terminé!"
