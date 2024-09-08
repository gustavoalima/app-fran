import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

function Alunos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAluno, setNewAluno] = useState({
    nome: '',
    cep: '',
    endereco: '',
    dataNascimento: '',
    idade: '',
    sexo: '',
    telefone: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alunos');
      setAlunos(response.data.alunos);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAluno({ ...newAluno, [name]: value });
  };

  const handleCepBlur = async () => {
    if (newAluno.cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${newAluno.cep}/json/`);
        if (response.data && !response.data.erro) {
          setNewAluno({ ...newAluno, endereco: `${response.data.logradouro},` });
        } else {
          alert('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar o endereço:', error);
      }
    } else {
      alert('CEP deve ter 8 dígitos.');
    }
  };

  const handleDataNascimentoChange = (e) => {
    const dataNascimento = e.target.value;
    const idade = calcularIdade(dataNascimento);
    setNewAluno({ ...newAluno, dataNascimento, idade });
  };

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleAddAluno = async () => {
    try {
      await axios.post('http://localhost:5000/alunos', newAluno);
      fetchAlunos();
      setModalOpen(false);
      setNewAluno({
        nome: '',
        cep: '',
        endereco: '',
        dataNascimento: '',
        idade: '',
        sexo: '',
        telefone: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
    }
  };

  return (
    <div className="container">
      <div className="back-button" onClick={() => navigate('/menu')}>
        <i className="fas fa-arrow-left"></i> Voltar ao Menu
      </div>
      <h2>Gerenciamento de Alunos</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar aluno"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setModalOpen(true)}>Adicionar Aluno</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Data de Nascimento</th>
            <th>Idade</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {alunos
            .filter((aluno) => aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.endereco}</td>
                <td>{aluno.dataNascimento}</td>
                <td>{aluno.idade}</td>
                <td>{aluno.telefone}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Adicionar Novo Aluno</h3>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={newAluno.nome}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              value={newAluno.cep}
              onChange={handleInputChange}
              onBlur={handleCepBlur}
              required
            />
            <input
              type="text"
              name="endereco"
              placeholder="Endereço"
              value={newAluno.endereco}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="dataNascimento"
              placeholder="Data de Nascimento"
              value={newAluno.dataNascimento}
              onChange={handleDataNascimentoChange}
              required
            />
            <input
              type="text"
              name="idade"
              placeholder="Idade"
              value={newAluno.idade}
              readOnly
            />
            <select
              name="sexo"
              value={newAluno.sexo}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione o Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={newAluno.telefone}
              onChange={handleInputChange}
              required
            />

            <div className="modal-actions">
              <button onClick={handleAddAluno}>Salvar</button>
              <button onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alunos;
