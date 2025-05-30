import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faTable, faRefresh } from '@fortawesome/free-solid-svg-icons';
import './Resultados.css'; // Importando o CSS separado

const Resultados = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [activeTab, setActiveTab] = useState('grafico');
  const navigate = useNavigate();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchResultados();
  }, []);

  const fetchResultados = async () => {
    setLoading(true);
    try {
      const res = await api.get('/votos/resultados');
      const dadosFormatados = res.data.map((item, index) => ({
        ...item,
        nome: item.nomeChapa,
        votos: item.totalVotos,
        fill: COLORS[index % COLORS.length]
      }));
      setDados(dadosFormatados);
    } catch (err) {
      setErro('Erro ao buscar resultados. Tente recarregar.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalVotos = dados.reduce((sum, item) => sum + item.votos, 0);

  return (
    <div className="resultados-container">
      <div className="resultados-header">
        <div className="resultados-card shadow">
          <div className="card-header-primary">
            <h2>
              <FontAwesomeIcon icon={faChartBar} className="me-2" />
              Resultados da Votação
            </h2>
            <div>
              <button 
                className="btn-refresh"
                onClick={fetchResultados}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faRefresh} className={loading ? "fa-spin" : ""} />
                {loading ? ' Atualizando...' : ' Atualizar'}
              </button>
              <button 
                className="btn-home"
                onClick={() => navigate('/')}
              >
                <FontAwesomeIcon icon={faHome} className="me-1" />
                Voltar
              </button>
            </div>
          </div>
          
          <div className="card-body">
            {erro && (
              <div className="alert-error">
                <span>{erro}</span>
                <button className="btn-try-again" onClick={fetchResultados}>
                  Tentar novamente
                </button>
              </div>
            )}

            <div className="results-controls">
              <h5>Total de votos: {totalVotos}</h5>
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${activeTab === 'grafico' ? 'active' : ''}`}
                  onClick={() => setActiveTab('grafico')}
                >
                  <FontAwesomeIcon icon={faChartBar} /> Gráfico
                </button>
                <button
                  className={`tab-btn ${activeTab === 'tabela' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tabela')}
                >
                  <FontAwesomeIcon icon={faTable} /> Tabela
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner" role="status"></div>
                <p>Carregando resultados...</p>
              </div>
            ) : dados.length > 0 ? (
              <>
                {activeTab === 'grafico' && (
                  <div className="charts-container">
                    <div className="chart-card">
                      <div className="chart-header">
                        <h5>Distribuição de Votos</h5>
                      </div>
                      <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dados}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nome" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="votos" name="Votos" radius={[4, 4, 0, 0]}>
                              {dados.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="chart-card">
                      <div className="chart-header">
                        <h5>Percentual de Votos</h5>
                      </div>
                      <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={dados}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              dataKey="votos"
                              nameKey="nome"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            >
                              {dados.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value, name, props) => [
                                value,
                                `${name}: ${((value / totalVotos) * 100).toFixed(1)}%`
                              ]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tabela' && (
                  <div className="table-container">
                    <div className="table-header">
                      <h5>Resultados Detalhados</h5>
                    </div>
                    <div className="table-responsive">
                      <table className="results-table">
                        <thead>
                          <tr>
                            <th>Posição</th>
                            <th>Chapa</th>
                            <th>Votos</th>
                            <th>Percentual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dados
                            .sort((a, b) => b.votos - a.votos)
                            .map((item, index) => (
                              <tr key={item.nome}>
                                <td>{index + 1}º</td>
                                <td>
                                  <span 
                                    className="color-badge" 
                                    style={{ backgroundColor: item.fill }}
                                  ></span>
                                  {item.nome}
                                </td>
                                <td>{item.votos}</td>
                                <td>
                                  <div className="progress-bar-container">
                                    <div
                                      className="progress-bar"
                                      style={{ 
                                        width: `${(item.votos / totalVotos) * 100}%`,
                                        backgroundColor: item.fill
                                      }}
                                    >
                                      {(item.votos / totalVotos * 100).toFixed(1)}%
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                Nenhum resultado disponível para exibição.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultados;