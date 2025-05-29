import React from 'react';
import './Teclado.css';

const Teclado = ({ onNumero, onBranco, onCorrige, onConfirma }) => {
  const botoes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="teclado">
      <div className="teclado-grid">
        {botoes.map((num) => (
          <button key={num} className="tecla numero" onClick={() => onNumero(num)}>
            {num}
          </button>
        ))}
      </div>

      <div className="teclado-funcionais">
        <button className="tecla branco" onClick={onBranco} disabled>
          Branco
        </button>
        <button className="tecla corrige" onClick={onCorrige}>
          Corrige
        </button>
        <button className="tecla confirma" onClick={onConfirma}>
          Confirma
        </button>
      </div>
    </div>
  );
};

export default Teclado;
