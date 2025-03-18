import React, { useEffect, useState } from 'react';

const GeographicHotspotsMap = ({ hotspots, heatmapData }) => {
  const [isClient, setIsClient] = useState(false);
  const [map, setMap] = useState(null);
  const [leaflet, setLeaflet] = useState(null);
  const [heatLayer, setHeatLayer] = useState(null);
  const [markersLayer, setMarkersLayer] = useState(null);

  // Initialize client-side only libraries after component mounts
  useEffect(() => {
    setIsClient(true);
    
    // Import Leaflet libraries on client side only
    import('leaflet').then(L => {
      setLeaflet(L.default);
      
      // Import heat plugin
      import('leaflet.heat').then(() => {
        // Initialize the map
        const mapInstance = L.default.map('hotspots-map').setView([20, 0], 2);
        
        // Add the base tile layer
        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        
        setMap(mapInstance);
      });
    });
    
    // Cleanup
    return () => {
      if (map) map.remove();
    };
  }, []);

  // Add hotspots to map when data and map are available
  useEffect(() => {
    if (!map || !leaflet || !hotspots || hotspots.length === 0) return;
    
    // Remove existing markers layer if it exists
    if (markersLayer) {
      map.removeLayer(markersLayer);
    }
    
    // Create a new markers layer
    const markers = leaflet.layerGroup();
    
    // Add markers for each hotspot
    hotspots.forEach(spot => {
      if (spot.location && typeof spot.location.lat === 'number' && typeof spot.location.lng === 'number') {
        const marker = leaflet.marker([spot.location.lat, spot.location.lng])
          .bindPopup(`
            <div>
              <h3 class="font-bold">${spot.count} Reports</h3>
              <div class="mt-2">
                ${spot.categories && spot.categories.length > 0 ? 
                  `<p><strong>Categories:</strong></p>
                   <ul class="mt-1">
                    ${spot.categories.map(cat => 
                      `<li>${cat.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${cat.count}</li>`
                    ).join('')}
                   </ul>`
                  : ''
                }
              </div>
            </div>
          `);
        markers.addLayer(marker);
      }
    });
    
    // Add the markers layer to the map
    markers.addTo(map);
    setMarkersLayer(markers);
    
    // Adjust map view to fit all markers
    const bounds = leaflet.featureGroup(markers.getLayers()).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    }
  }, [map, leaflet, hotspots, markersLayer]);

  // Add heatmap layer when data and map are available
  useEffect(() => {
    if (!map || !leaflet || !heatmapData || heatmapData.length === 0) return;
    
    // Remove existing heat layer if it exists
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }
    
    // Create the heat layer
    const heatPoints = heatmapData.map(point => {
      return [point.lat, point.lng, point.weight || 1];
    });
    
    try {
      const heat = leaflet.heatLayer(heatPoints, { 
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'} 
      });
      
      heat.addTo(map);
      setHeatLayer(heat);
    } catch (error) {
      console.error("Error creating heat layer:", error);
    }
  }, [map, leaflet, heatmapData, heatLayer]);

  if (!isClient) {
    return (
      <div className="h-80 mb-4 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div id="hotspots-map" className="h-80 mb-4 relative z-0">
      {(!hotspots || hotspots.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">No geographic data available</p>
        </div>
      )}
    </div>
  );
};

export default GeographicHotspotsMap;