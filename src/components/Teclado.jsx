import React from 'react';

const Teclado = ({ onNumero, onBranco, onCorrige, onConfirma }) => {
  const botoes = ['1','2','3','4','5','6','7','8','9','0'];

  return (
    <div className="mt-4">
      <div className="row g-2">
        {botoes.slice(0, 9).map((num, index) => (
          <div key={num} className="col-4">
            <button
              className="btn btn-outline-dark w-100 py-3 fs-4"
              onClick={() => onNumero(num)}
            >
              {num}
            </button>
          </div>
        ))}
        <div className="col-4 offset-4">
          <button
            className="btn btn-outline-dark w-100 py-3 fs-4"
            onClick={() => onNumero('0')}
          >
            0
          </button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-4">
          <button className="btn btn-light w-100" onClick={onBranco}>Branco</button>
        </div>
        <div className="col-4">
          <button className="btn btn-warning text-white w-100" onClick={onCorrige}>Corrige</button>
        </div>
        <div className="col-4">
          <button className="btn btn-success w-100" onClick={onConfirma}>Confirma</button>
        </div>
      </div>
    </div>
  );
};

export default Teclado;
