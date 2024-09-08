import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';


function Avaliacoes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAvaliacao, setNewAvaliacao] = useState({
    nome: '',
    data: '',
    alunoId: '',
  });
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlunos();
    fetchAvaliacoes();
  }, []);

  useEffect(() => {
    setFilteredAlunos(
      alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, alunos]);

  const fetchAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alunos');
      setAlunos(response.data.alunos);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const fetchAvaliacoes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/avaliacoes');
      setAvaliacoes(response.data.avaliacoes);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAvaliacao({ ...newAvaliacao, [name]: value });
  };

  const handleAddAvaliacao = () => {
    setModalOpen(true);
  };

  const handleSaveAvaliacao = async () => {
    try {
      const aluno = alunos.find(a => a.nome === newAvaliacao.nome);
      if (aluno) {
        setNewAvaliacao(prevState => ({ ...prevState, alunoId: aluno.id }));

        const sexo = aluno.sexo.toLowerCase();

        if (sexo === 'masculino') {
          navigate('/avaliacao-masculina', {
            state: {
              alunoId: aluno.id,
              nome: aluno.nome,
              idade: aluno.idade
            }
          });
        } else if (sexo === 'feminino') {
          navigate('/avaliacao-feminina', {
            state: { alunoId: aluno.id,
              nome: aluno.nome,
              idade: aluno.idade
             }
          });
        } else {
          console.error('Sexo do aluno inválido');
        }

        setModalOpen(false);
      } else {
        console.error('Aluno não encontrado');
      }
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    }
  };

  const handleBackToMenu = () => {
    navigate('/menu'); // Ajuste a rota conforme necessário
  };

  return (
    <div className="container">
      <h2>Avaliações</h2>
      <button onClick={handleBackToMenu}>Voltar ao Menu</button>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar avaliação"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleAddAvaliacao}>Adicionar Avaliação</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data da Avaliação</th>
          </tr>
        </thead>
        <tbody>
          {avaliacoes
            .filter(avaliacao => avaliacao.nome.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(avaliacao => (
              <tr key={avaliacao.id}>
                <td>{avaliacao.nome}</td>
                <td>{avaliacao.data}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Adicionar Nova Avaliação</h3>
            <input
              type="text"
              name="nome"
              placeholder="Nome do Aluno"
              value={newAvaliacao.nome}
              onChange={handleInputChange}
              list="alunos"
            />
            <datalist id="alunos">
              {filteredAlunos.map(aluno => (
                <option key={aluno.id} value={aluno.nome} />
              ))}
            </datalist>
            <input
              type="date"
              name="data"
              placeholder="Data da Avaliação"
              value={newAvaliacao.data}
              onChange={handleInputChange}
              required
            />
            <div className="modal-actions">
              <button onClick={handleSaveAvaliacao}>Salvar</button>
              <button onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Avaliacoes;
