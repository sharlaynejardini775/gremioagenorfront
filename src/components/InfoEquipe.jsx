import React from 'react';
import './InfoEquipe.css';

const InfoEquipe = ({ equipe, branco, nulo }) => {
  if (branco) {
    return (
      <div className="info-card branco">
        <p className="info-titulo">VOTO EM BRANCO</p>
      </div>
    );
  }

  if (nulo) {
    return (
      <div className="info-card nulo">
        <p className="info-titulo">VOTO NULO</p>
        <span className="info-subtitulo">Número inválido</span>
      </div>
    );
  }

  if (!equipe) return (
    <div className="info-card placeholder">
      <p className="info-placeholder-text">Digite o número da chapa</p>
    </div>
  );

  return (
    <div className="info-card chapa">
      <p className="info-label">Nome da Chapa</p>
      <p className="info-titulo">{equipe.nome}</p>

      <p className="info-label">Número</p>
      <p className="info-numero">{equipe.numero}</p>

      {equipe.imagemUrl && (
        <div className="info-imagem-wrapper">
          <img
            src={equipe.imagemUrl}
            alt={`Foto da chapa ${equipe.nome}`}
            className="info-imagem"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/180x180?text=Imagem+Indisponível';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InfoEquipe;
