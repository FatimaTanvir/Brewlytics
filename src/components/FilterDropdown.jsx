import React from 'react';

const FilterDropdown = ({ selectedType, onTypeChange, selectedState, onStateChange, states }) => (
  <div className="filter-container">
    <div className="filter-group">
      <label className="filter-label">Filter by Type</label>
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="filter-select"
      >
        <option value="">All Types</option>
        <option value="micro">Micro</option>
        <option value="nano">Nano</option>
        <option value="regional">Regional</option>
        <option value="brewpub">Brewpub</option>
        <option value="contract">Contract</option>
        <option value="proprietor">Proprietor</option>
        <option value="planning">Planning</option>
      </select>
    </div>
    <div className="filter-group">
      <label className="filter-label">Filter by State</label>
      <select
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        className="filter-select"
      >
        <option value="">All States</option>
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
    </div>
  </div>
);

export default FilterDropdown;