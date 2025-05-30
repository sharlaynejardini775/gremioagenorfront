import React, { useState, useEffect, useRef } from 'react';
import InfoEquipe from './InfoEquipe';
import Teclado from './Teclado';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Referências para os áudios
  const audioConfirmacao = useRef(new Audio('/audio/confirma-urna.mp3'));
  const audioErro = useRef(new Audio('/audio/erro.mp3'));

  // Configurar áudios quando o componente montar
  useEffect(() => {
    // Configurações iniciais dos áudios
    audioConfirmacao.current.volume = 1;
    audioErro.current.volume = 1;
    audioConfirmacao.current.load();
    audioErro.current.load();

    return () => {
      // Limpeza quando o componente desmontar
      audioConfirmacao.current.pause();
      audioErro.current.pause();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosRes, chapasRes] = await Promise.all([
          api.get('/alunos'),
          api.get('/chapas')
        ]);
        
        setAnos([...new Set(alunosRes.data.map(a => a.ano))]);
        setChapas(chapasRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        playErrorSound();
        alert('Erro ao carregar dados da votação!');
      }
    };

    fetchData();
  }, []);

  const playConfirmationSound = async () => {
    try {
      audioConfirmacao.current.currentTime = 0;
      await audioConfirmacao.current.play();
    } catch (err) {
      console.error('Erro ao tocar áudio de confirmação:', err);
    }
  };

  const playErrorSound = async () => {
    try {
      audioErro.current.currentTime = 0;
      await audioErro.current.play();
    } catch (err) {
      console.error('Erro ao tocar áudio de erro:', err);
    }
  };

  useEffect(() => {
    if (input.length === 1) {
      const chapaEncontrada = chapas.find(c => c.numero.toString() === input);
      setEquipe(chapaEncontrada || null);
      setNulo(!chapaEncontrada);
    } else {
      setEquipe(null);
      setNulo(false);
    }
  }, [input, chapas]);

  const handleAnoChange = async (e) => {
    const ano = e.target.value;
    setAnoSelecionado(ano);
    setAlunoSelecionado(null);
    resetarEstado();
    
    try {
      const res = await api.get(`/alunos/ano/${ano}`);
      setAlunos(res.data);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      playErrorSound();
      alert('Erro ao carregar alunos deste ano!');
    }
  };

  const handleAlunoChange = (e) => {
    const aluno = alunos.find(a => a.id === parseInt(e.target.value));
    if (aluno?.jaVotou) {
      playErrorSound();
      alert('Este aluno já votou! Selecione outro.');
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
    resetarEstado();
    setBranco(true);
  };

  const handleCorrige = () => {
    if (confirmado) return;
    resetarEstado();
  };

  const handleConfirma = async () => {
    if (confirmado || !alunoSelecionado) return;
    
    if (!input && !branco) {
      playErrorSound();
      alert('Digite um número ou vote em branco!');
      return;
    }

    try {
      await api.post(`/alunos/${alunoSelecionado.id}/votar`, {
        numeroChapa: branco ? 0 : parseInt(input)
      });
      
      await playConfirmationSound();
      setConfirmado(true);
      alert('Voto registrado com sucesso!');
      
      // Resetar após 2 segundos
      setTimeout(() => {
        resetarEstadoCompleto();
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao votar:', err);
      playErrorSound();
      alert(err.response?.data?.erro || 'Erro ao registrar voto!');
    }
  };

  const resetarEstado = () => {
    setInput('');
    setEquipe(null);
    setBranco(false);
    setNulo(false);
  };

  const resetarEstadoCompleto = () => {
    resetarEstado();
    setConfirmado(false);
    setAlunoSelecionado(null);
    setAnoSelecionado('');
  };

  const handleResultados = () => {
    const senha = prompt('Digite a senha para acessar os resultados:');
    if (senha === '456789') {
      navigate('/resultados');
    } else {
      playErrorSound();
      alert('Senha incorreta!');
    }
  };

  return (
    <div className="urna-container">
      <div className="urna-box">
        <header className="urna-header">
          <h1>VOTAÇÃO GRÊMIO ESTUDANTIL 2025</h1>
        </header>
        
        <div className="urna-content">
          <div className="urna-panel left-panel">
            <div className="selecao-container">
              <div className="selecao-group">
                <label>ANO:</label>
                <select 
                  value={anoSelecionado} 
                  onChange={handleAnoChange}
                  disabled={confirmado}
                >
                  <option value="">Selecione</option>
                  {anos.map(ano => (
                    <option key={ano} value={ano}>{ano}º Ano</option>
                  ))}
                </select>
              </div>

              {anoSelecionado && (
                <div className="selecao-group">
                  <label>ALUNO:</label>
                  <select 
                    value={alunoSelecionado?.id || ''} 
                    onChange={handleAlunoChange}
                    disabled={confirmado}
                  >
                    <option value="">Selecione</option>
                    {alunos.map(a => (
                      <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="numero-display-container">
              <div>NÚMERO DIGITADO:</div>
              <div className="numero-display">
                {input || <span className="numero-placeholder">_</span>}
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