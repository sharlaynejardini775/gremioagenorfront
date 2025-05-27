import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GraficoResultado from '../components/GraficoResultado';

const Resultados = () => {
const [dados, setDados] = useState([]);
const [erro, setErro] = useState('');
const navigate = useNavigate();

useEffect(() => {
const fetchResultados = async () => {
try {
const res = await api.get('/votos/resultados');
const dadosFormatados = res.data.map((item) => ({
nome: item.nomeChapa,
votos: item.totalVotos
}));
setDados(dadosFormatados);
} catch (err) {
setErro('Erro ao buscar resultados.');
console.error(err);
}
};

fetchResultados();
}, []);

return (
<div className="container mt-5 p-4 bg-light rounded shadow">
<div className="d-flex justify-content-between align-items-center mb-4">
<h2>Resultado da Votação</h2>
<button className="btn btn-primary" onClick={() => navigate('/')}>
Voltar para Urna
</button>
</div>


  {erro && <div className="alert alert-danger">{erro}</div>}

  {dados.length > 0 ? (
    <GraficoResultado dados={dados} />
  ) : (
    <p className="text-center">Carregando resultados...</p>
  )}
</div>
);
};

export default Resultados;