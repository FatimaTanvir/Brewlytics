import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className={`stats-card ${color}`}>
    <div className="stats-card-content">
      <div className="stats-card-text">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
      <Icon className="stats-card-icon" />
    </div>
  </div>
);

export default StatsCard;