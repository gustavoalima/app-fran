const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database.db');

// Criação de tabelas se não existirem
db.serialize(() => {
  // Tabela de usuários
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)", (err) => {
    if (err) console.error("Erro ao criar tabela de usuários:", err.message);
  });

  // Tabela de alunos
  db.run("CREATE TABLE IF NOT EXISTS alunos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, cep TEXT, endereco TEXT, dataNascimento TEXT, idade INTEGER, sexo TEXT, telefone TEXT)", (err) => {
    if (err) console.error("Erro ao criar tabela de alunos:", err.message);
  });

  // Tabela de avaliações
  db.run("CREATE TABLE IF NOT EXISTS avaliacoes (id INTEGER PRIMARY KEY AUTOINCREMENT, aluno_id INTEGER, dataAvaliacao TEXT, FOREIGN KEY(aluno_id) REFERENCES alunos(id))", (err) => {
    if (err) console.error("Erro ao criar tabela de avaliações:", err.message);
  });

  // Tabela de avaliações masculinas
  db.run(
    `CREATE TABLE IF NOT EXISTS avaliacao_masculina (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER,
      nome TEXT,
      idade INTEGER,
      peso REAL,
      altura REAL,
      peitoral REAL,
      axilar_media REAL,
      triceps REAL,
      subescapular REAL,
      abdomen REAL,
      supra_iliaca REAL,
      coxa REAL,
      percentual_gordura REAL,
      percentual_massa_magra REAL,
      massa_gordura_kg REAL,
      massa_magra_kg REAL,
      imc REAL,
      classificacao_imc TEXT,
      FOREIGN KEY(aluno_id) REFERENCES alunos(id)
    )`,
    (err) => {
      if (err) console.error("Erro ao criar tabela de avaliação masculina:", err.message);
    }
  );

  // Tabela de avaliações femininas
  db.run(
    `CREATE TABLE IF NOT EXISTS avaliacao_feminina (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER,
      nome TEXT,
      idade INTEGER,
      peso REAL,
      altura REAL,
      peitoral REAL,
      axilar_media REAL,
      triceps REAL,
      subescapular REAL,
      abdomen REAL,
      supra_iliaca REAL,
      coxa REAL,
      percentual_gordura REAL,
      percentual_massa_magra REAL,
      massa_gordura_kg REAL,
      massa_magra_kg REAL,
      imc REAL,
      classificacao_imc TEXT,
      FOREIGN KEY(aluno_id) REFERENCES alunos(id)
    )`,
    (err) => {
      if (err) console.error("Erro ao criar tabela de avaliações femininas:", err.message);
    }
  );
});

// Rota de registro de usuários
app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Error registering user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (!user) return res.status(400).json({ message: 'User not found' });

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords' });
      if (!result) return res.status(400).json({ message: 'Invalid password' });

      const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Rota para adicionar/salvar o aluno
app.post('/alunos', (req, res) => {
  const { nome, cep, endereco, dataNascimento, idade, sexo, telefone } = req.body;

  if (!nome || !cep || !endereco || !dataNascimento || !idade || !sexo || !telefone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  db.run("INSERT INTO alunos (nome, cep, endereco, dataNascimento, idade, sexo, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nome, cep, endereco, dataNascimento, idade, sexo, telefone],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar aluno' });
      }
      res.status(201).json({ message: 'Aluno cadastrado com sucesso', alunoId: this.lastID });
    });
});

// Rota para listar todos os alunos
app.get('/alunos', (req, res) => {
  db.all("SELECT * FROM alunos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar alunos' });
    }
    res.json({ alunos: rows });
  });
});

// Rota para obter informações do aluno pelo ID
app.get('/alunos/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM alunos WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Error fetching student' });
    if (!row) return res.status(404).json({ message: 'Student not found' });
    res.json(row);
  });
});

// Rota para adicionar avaliação
app.post('/avaliacoes', (req, res) => {
  const { aluno_id, dataAvaliacao } = req.body;

  if (!aluno_id || !dataAvaliacao) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  db.run("INSERT INTO avaliacoes (aluno_id, dataAvaliacao) VALUES (?, ?)", [aluno_id, dataAvaliacao], function (err) {
    if (err) return res.status(500).json({ message: 'Error adding evaluation' });
    res.status(201).json({ message: 'Evaluation added successfully' });
  });
});

// Rota para obter avaliações
app.get('/avaliacoes', (req, res) => {
  const { sexo } = req.query;

  let query = "SELECT * FROM avaliacoes JOIN alunos ON avaliacoes.aluno_id = alunos.id WHERE 1=1";
  let params = [];

  if (sexo) {
    query += " AND alunos.sexo = ?";
    params.push(sexo);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching evaluations' });
    res.json({ avaliacoes: rows });
  });
});

// Rota para salvar avaliação masculina
app.post('/avaliacao-masculina', (req, res) => {
  const {
    aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa,
    percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc
  } = req.body;

  if (!aluno_id || !nome || !idade || !peso || !altura || !peitoral || !axilar_media || !triceps || !subescapular || !abdomen || !supra_iliaca || !coxa || !percentual_gordura || !percentual_massa_magra || !massa_gordura_kg || !massa_magra_kg || !imc || !classificacao_imc) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  db.run(
    `INSERT INTO avaliacao_masculina (aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error adding male evaluation' });
      res.status(201).json({ message: 'Male evaluation added successfully' });
    }
  );
});

// Rota para salvar avaliação feminina
app.post('/avaliacao-feminina', (req, res) => {
  const {
    aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa,
    percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc
  } = req.body;

  if (!aluno_id || !nome || !idade || !peso || !altura || !peitoral || !axilar_media || !triceps || !subescapular || !abdomen || !supra_iliaca || !coxa || !percentual_gordura || !percentual_massa_magra || !massa_gordura_kg || !massa_magra_kg || !imc || !classificacao_imc) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  db.run(
    `INSERT INTO avaliacao_feminina (aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error adding female evaluation' });
      res.status(201).json({ message: 'Female evaluation added successfully' });
    }
  );
});

// Iniciar o servidor
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
