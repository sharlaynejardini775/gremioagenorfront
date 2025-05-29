import React from 'react';
import './InfoEquipe.css';

const InfoEquipe = ({ equipe, branco, nulo }) => {
  // Se for voto branco/nulo ou nenhuma equipe selecionada
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

  if (!equipe) {
    return (
      <div className="info-card placeholder">
        <p className="info-placeholder-text">Digite o número da chapa</p>
      </div>
    );
  }

  // Gera o caminho da imagem baseado no número da chapa (PNG)
  const imagemPath = `/imagens/chapa-${equipe.numero}.png`;

  return (
    <div className="info-card chapa">
      <p className="info-label">Nome da Chapa</p>
      <p className="info-titulo">{equipe.nome}</p>

      <p className="info-label">Número</p>
      <p className="info-numero">{equipe.numero}</p>

      <div className="info-imagem-wrapper">
        <img
          src={imagemPath}
          alt={`Logo da chapa ${equipe.nome}`}
          onError={(e) => {
            // Fallback se a imagem não existir
            e.target.src = '/imagens/default.png';
          }}
        />
      </div>
    </div>
  );
};

export default InfoEquipe;