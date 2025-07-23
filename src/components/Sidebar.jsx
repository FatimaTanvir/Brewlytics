import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ className = '' }) => (
  <aside className={`sidebar ${className}`}>
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">Brewery App</h2>
      <p className="text-gray-500 text-sm">Explore US Breweries</p>
    </div>
    <nav>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="text-blue-600 hover:underline font-medium">Dashboard</Link>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar; 