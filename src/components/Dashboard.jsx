import React, { useState, useEffect } from 'react';
import { Filter, BarChart3, Users, MapPin, Building } from 'lucide-react';
import StatsCard from './StatsCard';
import BreweryCard from './BreweryCard';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';

// API Base URL
const API_BASE = 'https://api.openbrewerydb.org/v1/breweries';

const Dashboard = () => {
  const [breweries, setBreweries] = useState([]);
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch breweries from API
  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}?per_page=200`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch breweries');
        }
        
        const data = await response.json();
        setBreweries(data);
        setFilteredBreweries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();
  }, []);

  // Filter breweries based on search term and filters
  useEffect(() => {
    let filtered = breweries;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(brewery =>
        brewery.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(brewery =>
        brewery.brewery_type === selectedType
      );
    }

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter(brewery =>
        brewery.state === selectedState
      );
    }

    setFilteredBreweries(filtered);
  }, [breweries, searchTerm, selectedType, selectedState]);

  // Calculate statistics
  const stats = {
    totalBreweries: breweries.length,
    uniqueStates: new Set(breweries.map(b => b.state).filter(Boolean)).size,
    mostCommonType: breweries.reduce((acc, brewery) => {
      acc[brewery.brewery_type] = (acc[brewery.brewery_type] || 0) + 1;
      return acc;
    }, {}),
    averagePerState: breweries.length > 0 ? Math.round(breweries.length / new Set(breweries.map(b => b.state).filter(Boolean)).size) : 0
  };

  const mostCommonTypeEntry = Object.entries(stats.mostCommonType).sort(([,a], [,b]) => b - a)[0];
  const mostCommonTypeName = mostCommonTypeEntry ? mostCommonTypeEntry[0] : 'N/A';

  // Get unique states for filter dropdown
  const uniqueStates = [...new Set(breweries.map(b => b.state).filter(Boolean))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading breweries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Brewery Dashboard</h1>
            </div>
            <p className="text-gray-600">Explore breweries across the United States</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Breweries"
            value={stats.totalBreweries.toLocaleString()}
            icon={Building}
            color="border-blue-500"
          />
          <StatsCard
            title="States Covered"
            value={stats.uniqueStates}
            icon={MapPin}
            color="border-green-500"
          />
          <StatsCard
            title="Most Common Type"
            value={mostCommonTypeName}
            icon={Users}
            color="border-purple-500"
          />
          <StatsCard
            title="Avg per State"
            value={stats.averagePerState}
            icon={BarChart3}
            color="border-yellow-500"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
          </div>
          <div className="space-y-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <FilterDropdown
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              states={uniqueStates}
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBreweries.length} of {breweries.length} breweries
          </div>
        </div>

        {/* Brewery List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Brewery Directory</h2>
          {filteredBreweries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No breweries found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredBreweries.map((brewery) => (
                <BreweryCard key={brewery.id} brewery={brewery} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;