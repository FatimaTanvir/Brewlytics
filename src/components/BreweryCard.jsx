import React from 'react';
import { MapPin, Building, Globe } from 'lucide-react';

const BreweryCard = ({ brewery }) => {
  const getBadgeClass = (type) => {
    switch (type) {
      case 'micro': return 'badge-micro';
      case 'brewpub': return 'badge-brewpub';
      case 'nano': return 'badge-nano';
      case 'regional': return 'badge-regional';
      default: return 'badge-default';
    }
  };

  return (
    <div className="brewery-card">
      <div className="brewery-card-header">
        <div className="brewery-card-content">
          <h3 className="brewery-card-title">{brewery.name}</h3>
          <div className="brewery-card-details">
            <div className="brewery-card-detail">
              <Building />
              <span className="capitalize">{brewery.brewery_type}</span>
            </div>
            {brewery.city && brewery.state && (
              <div className="brewery-card-detail">
                <MapPin />
                <span>{brewery.city}, {brewery.state}</span>
              </div>
            )}
            {brewery.country && (
              <div className="brewery-card-detail">
                <Globe />
                <span>{brewery.country}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`brewery-card-badge ${getBadgeClass(brewery.brewery_type)}`}>
          {brewery.brewery_type}
        </div>
      </div>
      {brewery.website_url && (
        <div className="brewery-card-website">
          <a 
            href={brewery.website_url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Visit Website →
          </a>
        </div>
      )}
    </div>
  );
};

export default BreweryCard;