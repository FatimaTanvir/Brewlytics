import React, { useState, useEffect } from 'react';
import { Filter, BarChart3, Users, MapPin, Building } from 'lucide-react';
import StatsCard from './StatsCard';
import BreweryCard from './BreweryCard';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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

  // Chart Data: Breweries per State
  const breweriesPerState = Object.entries(
    breweries.reduce((acc, b) => {
      if (b.state) acc[b.state] = (acc[b.state] || 0) + 1;
      return acc;
    }, {})
  ).map(([state, count]) => ({ state, count }));

  // Chart Data: Brewery Type Distribution
  const breweryTypeData = Object.entries(stats.mostCommonType).map(([type, count]) => ({ name: type, value: count }));
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1', '#f472b6', '#14b8a6'];

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
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Brewery Dashboard</h1>
            </div>
            {/* Search and Filters moved here */}
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow p-4">
                <div className="flex items-center mb-2">
                  <Filter className="h-5 w-5 text-blue-400 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Search & Filter</h2>
                </div>
                <div className="space-y-2">
                  <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                  <FilterDropdown
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                    selectedState={selectedState}
                    onStateChange={setSelectedState}
                    states={uniqueStates}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Showing {filteredBreweries.length} of {breweries.length} breweries
                </div>
              </div>
            </div>
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

        {/* Data Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart: Breweries per State */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Breweries per State</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={breweriesPerState.slice(0, 15)} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="state" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500 mt-2">Top 15 states by number of breweries</div>
          </div>
          {/* Pie Chart: Brewery Type Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Brewery Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={breweryTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {breweryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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