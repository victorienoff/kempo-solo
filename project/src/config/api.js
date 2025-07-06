// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://kempo-solo-production.up.railway.app' // URL Railway réelle
    : 'http://localhost:3000'
  );

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    COMPETITORS: `${API_BASE_URL}/api/competitors`,
    TOURNAMENTS: `${API_BASE_URL}/api/tournaments`,
    MATCHES: `${API_BASE_URL}/api/matches`,
    RANKS: `${API_BASE_URL}/api/ranks`,
    AGE_GROUPS: `${API_BASE_URL}/api/age-groups`,
    WEIGHT_CATEGORIES: `${API_BASE_URL}/api/weight-categories`,
  }
};

// Helper function pour construire les URLs
export const apiUrl = (path) => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
};

console.log('🔗 API Configuration:', {
  BASE_URL: API_BASE_URL,
  MODE: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL
});
