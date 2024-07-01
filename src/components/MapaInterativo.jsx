import React, { useState } from 'react';
import { ReactComponent as MapaSVG } from './img/map.svg';
import './MapaInterativo.css';

const MapaInterativo = ({ onRegionClick }) => {
  const [hoveredDDD, setHoveredDDD] = useState(null);
 

  const handleSVGClick = (e) => {
    const target = e.target;
    const ddd = target.getAttribute('data-ddd'); // Supondo que você tenha adicionado data-ddd aos elementos do SVG
    if (ddd) {
      onRegionClick(ddd);
    }
  };

  const handleMouseEnter = (e) => {
    const target = e.target;
    const ddd = target.getAttribute('data-ddd'); // Supondo que você tenha adicionado data-ddd aos elementos do SVG
    if (ddd) {
      setHoveredDDD(ddd);

    }
  };

  const handleMouseLeave = () => {
    setHoveredDDD(null);
  };

  return (
    <div className='mapa'>
    <div className="map-container">
      <MapaSVG 
        onClick={handleSVGClick} 
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      />
    </div>
    <div>
      {hoveredDDD && (
        <div className="tooltip" >
          DDD: {hoveredDDD}
        </div>
      )}
    </div>
    </div>
  );
};

export default MapaInterativo;
