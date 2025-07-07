import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${apiUrl("/api/password-reset/")}${password}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        window.alert('Mot de passe modifié avec succès.');
        navigate('/login');
        return;
      } else {
        setMessage('Erreur lors de la modification du mot de passe.');
      }
    } catch (error) {
      setMessage('Erreur réseau.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Modification...' : 'Modifier le mot de passe'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordReset;
