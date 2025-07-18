import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => (
  <div className="search-container">
    <Search className="search-icon" />
    <input
      type="text"
      placeholder="Search breweries by name..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="search-input"
    />
  </div>
);

export default SearchBar;