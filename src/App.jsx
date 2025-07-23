import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './App.css';

// Placeholder for Sidebar and DetailView (to be created)
import Sidebar from './components/Sidebar';
import DetailView from './components/DetailView';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar className="sidebar" />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/brewery/:id" element={<DetailView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;