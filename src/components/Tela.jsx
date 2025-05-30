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

  const audioConfirmacao = useRef(new Audio('/audio/confirma-urna.mp3'));
  const audioErro = useRef(new Audio('/audio/erro.mp3'));

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
        alert('Erro ao carregar dados dos alunos!');
      }
    };

    const fetchChapas = async () => {
      try {
        const res = await api.get('/chapas');
        setChapas(res.data);
      } catch (err) {
        console.error('Erro ao buscar chapas:', err);
        alert('Erro ao carregar dados das chapas!');
      }
    };

    fetchAlunos();
    fetchChapas();
  }, []);

  useEffect(() => {
    if (input.length === 1) {
      const encontrada = chapas.find((c) => String(c.numero) === input);
      setEquipe(encontrada || null);
      setNulo(!encontrada);
    } else {
      setEquipe(null);
      setNulo(false);
    }
  }, [input, chapas]);

  useEffect(() => {
    if (nulo) {
      audioErro.current.play();
      alert('Chapa não encontrada! Digite um número válido ou vote em branco.');
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
      alert('Erro ao carregar alunos deste ano!');
    }
  };

  const handleAlunoChange = (e) => {
    const id = parseInt(e.target.value);
    const aluno = alunos.find((a) => a.id === id);
    if (aluno?.jaVotou) {
      alert('Este aluno já votou! Selecione outro aluno.');
      setAlunoSelecionado(null);
    } else {
      setAlunoSelecionado(aluno);
    }
  };

  const handleNumero = (num) => {
    if (confirmado || !alunoSelecionado) return;
    setInput(num);
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
  };

  const handleConfirma = async () => {
    if (confirmado || !alunoSelecionado) return;
    
    if (!input && !branco) {
      alert('Por favor, digite um número ou vote em branco!');
      return;
    }

    const numeroChapa = branco ? 0 : parseInt(input);

    try {
      await api.post(`/alunos/${alunoSelecionado.id}/votar`, { numeroChapa });
      audioConfirmacao.current.play();
      setConfirmado(true);
      
      alert('Voto registrado com sucesso!');
      
      // Resetar para próximo voto
      setTimeout(() => {
        resetarEstado();
        // Voltar para tela inicial
        setAnoSelecionado('');
        setAlunoSelecionado(null);
        setAlunos([]);
      }, 1000);
    } catch (err) {
      console.error('Erro ao votar:', err);
      audioErro.current.play();
      alert(err.response?.data?.erro || 'Erro ao registrar voto!');
    }
  };

  const resetarEstado = () => {
    setInput('');
    setEquipe(null);
    setBranco(false);
    setNulo(false);
    setConfirmado(false);
  };

  const handleResultados = () => {
    const senha = prompt('Digite a senha para acessar os resultados:');
    if (senha === '456789') {
      window.location.href = '/resultados';
    } else {
      audioErro.current.play();
      alert('Senha incorreta!');
    }
  };

  return (
    <div className="urna-container">
      <div className="urna-box">
        <header className="urna-header">
          <h1 className="urna-title">VOTAÇÃO GRÊMIO ESTUDANTIL 2025</h1>
        </header>
        
        <div className="urna-content">
          <div className="urna-panel left-panel">
            <div className="selecao-container">
              <div className="selecao-group">
                <label className="selecao-label">ANO:</label>
                <select 
                  className="selecao-input" 
                  value={anoSelecionado} 
                  onChange={handleAnoChange}
                  disabled={confirmado}
                >
                  <option value="">Selecione</option>
                  {anos.map((ano) => (
                    <option key={ano} value={ano}>{ano}º Ano</option>
                  ))}
                </select>
              </div>

              {anoSelecionado && (
                <div className="selecao-group">
                  <label className="selecao-label">ALUNO:</label>
                  <select 
                    className="selecao-input" 
                    value={alunoSelecionado?.id || ''} 
                    onChange={handleAlunoChange}
                    disabled={confirmado}
                  >
                    <option value="">Selecione</option>
                    {alunos.map((a) => (
                      <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="numero-display-container">
              <div className="numero-display-label">NÚMERO DIGITADO:</div>
              <div className="numero-display">
                {input ? (
                  <span className="numero-digit">{input}</span>
                ) : (
                  <span className="numero-placeholder">_</span>
                )}
              </div>
            </div>

            <div className="info-container">
              <InfoEquipe equipe={equipe} branco={branco} nulo={nulo} />
            </div>
          </div>

          <div className="urna-panel right-panel">
            <Teclado
              onNumero={handleNumero}
              onBranco={handleBranco}
              onCorrige={handleCorrige}
              onConfirma={handleConfirma}
              disabled={confirmado || !alunoSelecionado}
            />
          </div>
        </div>

        <div className="urna-footer">
          <button className="resultados-btn" onClick={handleResultados}>
            VER RESULTADOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tela;