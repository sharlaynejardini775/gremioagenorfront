import React, { useState, useEffect, useRef } from 'react';
import InfoEquipe from './InfoEquipe';
import Teclado from './Teclado';
import api from '../services/api';
import './Urna.css';

const Tela = () => {
  const [anos, setAnos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [input, setInput] = useState('');
  const [chapas, setChapas] = useState([]);
  const [equipe, setEquipe] = useState(null);
  const [branco, setBranco] = useState(false);
  const [nulo, setNulo] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Refs para os elementos de áudio
  const audioConfirmacao = useRef(new Audio('/audio/confirma-urna.mp3'));
  const audioErro = useRef(new Audio('/audio/erro.mp3'));

  // Configura volume máximo ao montar o componente
  useEffect(() => {
    audioConfirmacao.current.volume = 1;
    audioErro.current.volume = 1;
  }, []);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const res = await api.get('/alunos');
        setAnos([...new Set(res.data.map((a) => a.ano))]);
      } catch (err) {
        console.error('Erro ao buscar anos:', err);
      }
    };

    const fetchChapas = async () => {
      try {
        const res = await api.get('/chapas');
        setChapas(res.data);
      } catch (err) {
        console.error('Erro ao buscar chapas:', err);
      }
    };

    fetchAlunos();
    fetchChapas();
  }, []);

  useEffect(() => {
    if (input.length === 1 || input.length === 2) {
      const encontrada = chapas.find((c) => String(c.numero) === input);
      setEquipe(encontrada || null);
      setNulo(!encontrada);
    } else {
      setEquipe(null);
      setNulo(false);
    }
  }, [input, chapas]);

  // Toca erro quando voto é nulo
  useEffect(() => {
    if (nulo) {
      audioErro.current.play();
    }
  }, [nulo]);

  const handleAnoChange = async (e) => {
    const ano = e.target.value;
    setAnoSelecionado(ano);
    setAlunoSelecionado(null);
    setInput('');
    setBranco(false);
    setNulo(false);
    setEquipe(null);
    setMensagem('');
    try {
      const res = await api.get(`/alunos/ano/${ano}`);
      setAlunos(res.data);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
    }
  };

  const handleAlunoChange = (e) => {
    const id = parseInt(e.target.value);
    const aluno = alunos.find((a) => a.id === id);
    if (aluno?.jaVotou) {
      setMensagem('Este aluno já votou!');
      setAlunoSelecionado(null);
    } else {
      setMensagem('');
      setAlunoSelecionado(aluno);
    }
  };

  const handleNumero = (num) => {
    if (confirmado || !alunoSelecionado) return;
    if (input.length < 2) setInput((prev) => prev + num);
  };

  const handleBranco = () => {
    if (confirmado || !alunoSelecionado) return;
    setInput('');
    setBranco(true);
    setNulo(false);
    setEquipe(null);
  };

  const handleCorrige = () => {
    if (confirmado) return;
    setInput('');
    setBranco(false);
    setNulo(false);
    setEquipe(null);
    setMensagem('');
  };

  const handleConfirma = async () => {
    if (confirmado || !alunoSelecionado) return;
    if (input.length >= 1 || branco) {
      const numeroChapa = branco ? 0 : parseInt(input);

      try {
        await api.post(`/alunos/${alunoSelecionado.id}/votar`, { numeroChapa });
        audioConfirmacao.current.play();
        alert('Voto registrado com sucesso!');
        resetarEstado();
      } catch (err) {
        console.error('Erro ao votar:', err);
        audioErro.current.play();
        setMensagem(err.response?.data?.erro || 'Erro ao registrar voto');
      }
    }
  };

  const resetarEstado = () => {
    setAnoSelecionado('');
    setAlunoSelecionado(null);
    setInput('');
    setEquipe(null);
    setBranco(false);
    setNulo(false);
    setConfirmado(false);
    setMensagem('');
  };

  return (
    <div className="urna-container">
      <div className="urna-box">
        <div className="urna-tela">
          <h2 className="titulo">VOTAÇÃO GRÊMIO - 2025</h2>

          {!confirmado && (
            <div className="urna-selecao">
              <select 
                className="select" 
                value={anoSelecionado} 
                onChange={handleAnoChange}
              >
                <option value="">Selecione o Ano</option>
                {anos.map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>

              {anoSelecionado && (
                <select 
                  className="select" 
                  value={alunoSelecionado?.id || ''} 
                  onChange={handleAlunoChange}
                >
                  <option value="">Selecione o Aluno</option>
                  {alunos.map((a) => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {alunoSelecionado && !confirmado && (
            <>
              <div className="numero-display">{input.padEnd(1, '_')}</div>

              <div className="urna-corpo">
                <div className="info-lado">
                  <InfoEquipe equipe={equipe} branco={branco} nulo={nulo} />
                </div>

                <div className="teclado-lado">
                  <Teclado
                    onNumero={handleNumero}
                    onBranco={handleBranco}
                    onCorrige={handleCorrige}
                    onConfirma={handleConfirma}
                  />
                </div>
              </div>
            </>
          )}

          {mensagem && <div className="mensagem">{mensagem}</div>}
        </div>
      </div>
    </div>
  );
};

export default Tela;