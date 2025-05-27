import React from 'react';

const InfoEquipe = ({ equipe, branco, nulo }) => {
  if (branco) {
    return (
      <div className="card text-center mt-4 shadow-sm border-secondary">
        <div className="card-body">
          <h5 className="text-secondary fw-bold mb-0">VOTO EM BRANCO</h5>
        </div>
      </div>
    );
  }

  if (nulo) {
    return (
      <div className="card text-center mt-4 shadow-sm border-danger">
        <div className="card-body">
          <h5 className="text-danger fw-bold">VOTO NULO</h5>
          <small className="text-muted">Número inválido</small>
        </div>
      </div>
    );
  }

  if (!equipe) return null;

  console.log("Chapa selecionada:", equipe);

  return (
    <div className="card text-center mt-4 shadow-sm border-primary">
      <div className="card-body">
        <h6 className="text-muted mb-1">Nome da Chapa</h6>
        <h5 className="fw-bold text-dark">{equipe.nome}</h5>

        <h6 className="text-muted mt-3 mb-1">Número</h6>
        <h6 className="fw-semibold">{equipe.numero}</h6>

        {equipe.imagemgUrl && (
          <div className="mt-3">
            <img
              src={equipe.imagemUrl}
              alt={`Foto da chapa ${equipe.nome}`}
              className="img-thumbnail rounded mx-auto d-block"
              style={{
                maxWidth: '180px',
                maxHeight: '180px',
                objectFit: 'cover',
                backgroundColor: '#f8f9fa'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/180x180?text=Imagem+Indisponível';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoEquipe;
