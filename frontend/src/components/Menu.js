import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';  // Importando Outlet
import '../App.css';

function Menu() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === 'Sair') {
      navigate('/login');
    }
  };

  return (
    <div className="menu-container">
      <div className="sidebar">
        <h2>Menu</h2>
        <Link
          to="dashboard"  // Rota relativa ao path "/menu"
          className={`menu-item ${activeItem === 'Dashboard' ? 'active' : ''}`}
          onClick={() => handleItemClick('Dashboard')}
        >
          Dashboard
        </Link>
        <Link
          to="alunos"  // Rota relativa ao path "/menu"
          className={`menu-item ${activeItem === 'Alunos' ? 'active' : ''}`}
          onClick={() => handleItemClick('Alunos')}
        >
          Alunos
        </Link>
        <Link
          to="avaliacoes"  // Rota relativa ao path "/menu"
          className={`menu-item ${activeItem === 'Avaliações' ? 'active' : ''}`}
          onClick={() => handleItemClick('Avaliações')}
        >
          Avaliações
        </Link>
        {/* Adicione outros links conforme necessário */}
        <Link
          to="/login"
          className={`menu-item ${activeItem === 'Sair' ? 'active' : ''}`}
          onClick={() => handleItemClick('Sair')}
        >
          Sair
        </Link>
      </div>
      <div className="content">
        <Outlet /> {/* Renderiza o conteúdo das subrotas aqui */}
      </div>
    </div>
  );
}

export default Menu;
