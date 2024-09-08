import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Real-time clock and date */}
      <div className="time-container">
        <p>{dateTime.toLocaleDateString()}</p>
        <p>{dateTime.toLocaleTimeString()}</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/menu/alunos" className="card">
          <h2>Alunos</h2>
          <p>Gerencie os alunos cadastrados.</p>
        </Link>

        <Link to="/menu/avaliacoes" className="card">
          <h2>Avaliações</h2>
          <p>Visualize e gerencie as avaliações.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
