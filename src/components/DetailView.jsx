import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = 'https://api.openbrewerydb.org/v1/breweries';

const DetailView = () => {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch brewery');
        const data = await response.json();
        setBrewery(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrewery();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!brewery) return <div className="p-8">No brewery found.</div>;

  return (
    <div className="p-8">
      <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{brewery.name}</h1>
      <div className="mb-4 text-gray-600">{brewery.brewery_type} in {brewery.city}, {brewery.state}</div>
      <div className="mb-2">Address: {brewery.street}, {brewery.city}, {brewery.state} {brewery.postal_code}</div>
      <div className="mb-2">Phone: {brewery.phone || 'N/A'}</div>
      <div className="mb-2">Website: {brewery.website_url ? <a href={brewery.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{brewery.website_url}</a> : 'N/A'}</div>
      <div className="mt-6 text-gray-700">
        <strong>More Info:</strong>
        <ul className="list-disc ml-6 mt-2">
          <li>Brewery ID: {brewery.id}</li>
          <li>Country: {brewery.country}</li>
          <li>Latitude: {brewery.latitude || 'N/A'}</li>
          <li>Longitude: {brewery.longitude || 'N/A'}</li>
          <li>Updated At: {brewery.updated_at}</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailView; 