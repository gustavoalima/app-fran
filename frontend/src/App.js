import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Menu from './components/Menu';
import Alunos from './components/Alunos';
import Avaliacoes from './components/Avaliacoes';
import AvaliacaoMasculina from './components/AvaliacaoMasculina';
import AvaliacaoFeminina from './components/AvaliacaoFeminina';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
        
        {/* Nested Routes for Menu */}
        <Route path="/menu" element={<Menu />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="alunos" element={<Alunos />} />
          <Route path="avaliacoes" element={<Avaliacoes />} />
          <Route path="avaliacao-masculina" element={<AvaliacaoMasculina />} />
          <Route path="avaliacao-feminina" element={<AvaliacaoFeminina />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
