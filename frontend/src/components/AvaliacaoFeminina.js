import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'; // Importa o arquivo CSS

const AvaliacaoFeminina = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const alunoId = location.state?.alunoId;

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [peitoral, setPeitoral] = useState('');
  const [axilarMedia, setAxilarMedia] = useState('');
  const [triceps, setTriceps] = useState('');
  const [subescapular, setSubescapular] = useState('');
  const [abdomen, setAbdomen] = useState('');
  const [supraIliaca, setSupraIliaca] = useState('');
  const [coxa, setCoxa] = useState('');
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  // Função para calcular resultados
  const calcularResultados = () => {
    const pesoKg = parseFloat(peso);
    const alturaM = parseFloat(altura) / 100;
    const idadeNum = parseFloat(idade);
    const peitoralNum = parseFloat(peitoral);
    const axilarMediaNum = parseFloat(axilarMedia);
    const tricepsNum = parseFloat(triceps);
    const subescapularNum = parseFloat(subescapular);
    const abdomenNum = parseFloat(abdomen);
    const supraIliacaNum = parseFloat(supraIliaca);
    const coxaNum = parseFloat(coxa);

    const S = peitoralNum + axilarMediaNum + tricepsNum + subescapularNum + abdomenNum + supraIliacaNum + coxaNum;
    const densidadeCorporal = 1.097 - 0.00046971 * S + 0.00000056 * S ** 2 - 0.00012828 * idadeNum;
    const percentualGordura = (495 / densidadeCorporal) - 450;
    const percentualMassaMagra = 100 - percentualGordura;
    const massaGorduraKg = (percentualGordura / 100) * pesoKg;
    const massaMagraKg = pesoKg - massaGorduraKg;
    const imc = pesoKg / (alturaM * alturaM);

    let classificacaoIMC = '';
    if (imc < 18.5) {
      classificacaoIMC = 'Abaixo do peso';
    } else if (imc >= 18.5 && imc < 24.9) {
      classificacaoIMC = 'Peso normal';
    } else if (imc >= 25 && imc < 29.9) {
      classificacaoIMC = 'Sobrepeso';
    } else {
      classificacaoIMC = 'Obesidade';
    }

    const resultados = {
      percentualGordura: percentualGordura.toFixed(2),
      percentualMassaMagra: percentualMassaMagra.toFixed(2),
      densidadeCorporal: densidadeCorporal.toFixed(4),
      massaGorduraKg: massaGorduraKg.toFixed(2),
      massaMagraKg: massaMagraKg.toFixed(2),
      imc: imc.toFixed(2),
      classificacaoIMC,
    };

    setResultados(resultados);
  };

  // Função para salvar a avaliação
  const salvarAvaliacao = async () => {
    if (!resultados) {
      setError('Por favor, calcule os resultados antes de salvar.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/avaliacao-feminina', {
        aluno_id: alunoId,
        nome,
        idade,
        peso,
        altura,
        peitoral,
        axilar_media: axilarMedia,
        triceps,
        subescapular,
        abdomen,
        supra_iliaca: supraIliaca,
        coxa,
        percentual_gordura: resultados.percentualGordura,
        percentual_massa_magra: resultados.percentualMassaMagra,
        massa_gordura_kg: resultados.massaGorduraKg,
        massa_magra_kg: resultados.massaMagraKg,
        imc: resultados.imc,
        classificacao_imc: resultados.classificacaoIMC,
      });

      alert('Avaliação salva com sucesso!');
      navigate('/menu');
    } catch (error) {
      setError('Erro ao salvar avaliação: ' + (error.response?.data?.error || error.message));
    }
  };

  // Função para buscar dados do aluno
  useEffect(() => {
    const fetchAlunoData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/alunos/${alunoId}`);
        setNome(response.data.nome);
        setIdade(response.data.idade);
        setPeso(response.data.peso || '');
        setAltura(response.data.altura || '');
        // Atualize outros campos se necessário
      } catch (error) {
        setError('Erro ao buscar dados do aluno: ' + (error.response?.data?.error || error.message));
      }
    };

    if (alunoId) {
      fetchAlunoData();
    }
  }, [alunoId]);

  return (
    <div className="container">
      <h2>Avaliação Feminina</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label>Idade:</label>
          <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} required />
        </div>
        <div>
          <label>Peso (kg):</label>
          <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} required />
        </div>
        <div>
          <label>Altura (cm):</label>
          <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} required />
        </div>
        <div>
          <label>Peitoral (mm):</label>
          <input type="number" value={peitoral} onChange={(e) => setPeitoral(e.target.value)} required />
        </div>
        <div>
          <label>Axilar Média (mm):</label>
          <input type="number" value={axilarMedia} onChange={(e) => setAxilarMedia(e.target.value)} required />
        </div>
        <div>
          <label>Tríceps (mm):</label>
          <input type="number" value={triceps} onChange={(e) => setTriceps(e.target.value)} required />
        </div>
        <div>
          <label>Subescapular (mm):</label>
          <input type="number" value={subescapular} onChange={(e) => setSubescapular(e.target.value)} required />
        </div>
        <div>
          <label>Abdômen (mm):</label>
          <input type="number" value={abdomen} onChange={(e) => setAbdomen(e.target.value)} required />
        </div>
        <div>
          <label>Supra-ilíaca (mm):</label>
          <input type="number" value={supraIliaca} onChange={(e) => setSupraIliaca(e.target.value)} required />
        </div>
        <div>
          <label>Coxa (mm):</label>
          <input type="number" value={coxa} onChange={(e) => setCoxa(e.target.value)} required />
        </div>
        <button type="button" onClick={calcularResultados}>Calcular</button>
      </form>
      {resultados && (
        <div className="resultados">
          <p>Percentual de Gordura: {resultados.percentualGordura}%</p>
          <p>Percentual de Massa Magra: {resultados.percentualMassaMagra}%</p>
          <p>Massa de Gordura (kg): {resultados.massaGorduraKg} kg</p>
          <p>Massa Magra (kg): {resultados.massaMagraKg} kg</p>
          <p>IMC: {resultados.imc}</p>
          <p>Classificação IMC: {resultados.classificacaoIMC}</p>
          <button type="button" onClick={salvarAvaliacao}>Salvar Avaliação</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AvaliacaoFeminina;
