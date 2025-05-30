import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tela from '../components/Tela';

const Urna = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const navigate = useNavigate();

  const handleShowResults = () => {
    setShowPasswordInput(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '456789') {
      navigate('/resultados');
    } else {
      setError('Senha incorreta!');
    }
  };

  return (
    <div>
      <Tela />
      
      <div style={{ 
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        {!showPasswordInput ? (
          <button
            onClick={handleShowResults}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Ver Resultados
          </button>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              style={{
                padding: '8px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Acessar Resultados
            </button>
            {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Urna;