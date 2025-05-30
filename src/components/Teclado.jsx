import React from 'react';
import './Teclado.css';

const Teclado = ({ onNumero, onBranco, onCorrige, onConfirma, disabled }) => {
  const botoes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="teclado-container">
      <div className="teclado-numerico">
        {botoes.map((num) => (
          <button 
            key={num} 
            className="tecla" 
            onClick={() => onNumero(num)}
            disabled={disabled}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="teclado-acoes">
        <button 
          className="acao-btn branco" 
          onClick={onBranco}
          disabled={disabled}
        >
          BRANCO
        </button>
        <button 
          className="acao-btn corrige" 
          onClick={onCorrige}
          disabled={disabled}
        >
          CORRIGE
        </button>
        <button 
          className="acao-btn confirma" 
          onClick={onConfirma}
          disabled={disabled}
        >
          CONFIRMA
        </button>
      </div>
    </div>
  );
};

export default Teclado;