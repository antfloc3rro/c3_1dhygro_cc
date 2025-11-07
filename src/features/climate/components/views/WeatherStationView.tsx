import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Select } from '../../../../components/ui/Select';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { ClimateData, LocationSearchResult } from '../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom icon for user marker (red)
let UserMarkerIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDEwIDEyLjUgMjguNSAxMi41IDI4LjVTMjUgMjIuNSAyNSAxMi41QzI1IDUuNiAxOS40IDAgMTIuNSAwem0wIDE3LjVjLTIuOCAwLTUtMi4yLTUtNXMyLjItNSA1LTUgNSAyLjIgNSA1LTIuMiA1LTUgNXoiIGZpbGw9IiNFQzUzNTMiLz48L3N2Zz4=',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherStationViewProps {
  onSelect: (location: LocationSearchResult) => void;
}

// Mock weather station data with sources
const mockWeatherStations: (LocationSearchResult & { source: string; comment: string })[] = [
  {
    id: 'albany-ny',
    city: 'Albany',
    country: 'USA',
    latitude: 42.65,
    longitude: -73.75,
    elevation: 100,
    source: 'WUFI-DB',
    comment: 'Albany International Airport, NY',
    availableDatasets: [{
      id: 'cold-year',
      source: 'WUFI-DB',
      period: { start: '1990-01-01', end: '2020-12-31' },
      dataQuality: 'measured'
    }]
  },
  {
    id: 'memphis-tn',
    city: 'Memphis',
    country: 'USA',
    latitude: 35.08,
    longitude: -90.02,
    elevation: 77,
    source: 'WUFI-DB',
    comment: 'Memphis International Airport, TN',
    availableDatasets: [{
      id: 'cold-year',
      source: 'WUFI-DB',
      period: { start: '1990-01-01', end: '2020-12-31' },
      dataQuality: 'measured'
    }]
  },
  {
    id: 'munich-de',
    city: 'Munich',
    country: 'Germany',
    latitude: 48.14,
    longitude: 11.58,
    elevation: 519,
    source: 'DWD',
    comment: 'Munich Weather Station, Germany',
    availableDatasets: [{
      id: 'typical-year',
      source: 'DWD',
      period: { start: '2010-01-01', end: '2019-12-31' },
      dataQuality: 'measured'
    }]
  },
  {
    id: 'berlin-de',
    city: 'Berlin',
    country: 'Germany',
    latitude: 52.52,
    longitude: 13.41,
    elevation: 34,
    source: 'DWD',
    comment: 'Berlin-Tempelhof Weather Station',
    availableDatasets: [{
      id: 'typical-year',
      source: 'DWD',
      period: { start: '2010-01-01', end: '2019-12-31' },
      dataQuality: 'measured'
    }]
  },
  {
    id: 'new-york-ny',
    city: 'New York',
    country: 'USA',
    latitude: 40.71,
    longitude: -74.01,
    elevation: 10,
    source: 'NOAA',
    comment: 'Central Park, New York, NY',
    availableDatasets: [{
      id: 'typical-year',
      source: 'NOAA',
      period: { start: '1990-01-01', end: '2020-12-31' },
      dataQuality: 'measured'
    }]
  },
  {
    id: 'chicago-il',
    city: 'Chicago',
    country: 'USA',
    latitude: 41.88,
    longitude: -87.63,
    elevation: 181,
    source: 'NOAA',
    comment: "O'Hare International Airport, IL",
    availableDatasets: [{
      id: 'typical-year',
      source: 'NOAA',
      period: { start: '1990-01-01', end: '2020-12-31' },
      dataQuality: 'measured'
    }]
  },
];

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Component to handle map clicks
function MapClickHandler({ onRightClick }: { onRightClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    contextmenu: (e) => {
      onRightClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function WeatherStationView({ onSelect }: WeatherStationViewProps) {
  const [selectedRegion, setSelectedRegion] = useState('USA, North America');
  const [selectedSource, setSelectedSource] = useState('All');
  const [citySearch, setCitySearch] = useState('');
  const [userMarker, setUserMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStation, setSelectedStation] = useState<typeof mockWeatherStations[0] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40, -95]);
  const [mapZoom, setMapZoom] = useState(4);

  // Filter stations by region and source
  const filteredStations = mockWeatherStations.filter(station => {
    const regionMatch = selectedRegion === 'USA, North America'
      ? station.country === 'USA'
      : station.country !== 'USA';
    const sourceMatch = selectedSource === 'All' || station.source === selectedSource;
    const cityMatch = citySearch === '' ||
      station.city.toLowerCase().includes(citySearch.toLowerCase()) ||
      station.comment.toLowerCase().includes(citySearch.toLowerCase());
    return regionMatch && sourceMatch && cityMatch;
  });

  // Calculate closest stations when user marker is placed
  const closestStations = userMarker
    ? filteredStations
        .map(station => ({
          ...station,
          distance: calculateDistance(
            userMarker.lat,
            userMarker.lng,
            station.latitude,
            station.longitude
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10)
    : [];

  const handleRightClick = (lat: number, lng: number) => {
    setUserMarker({ lat, lng });
    setMapCenter([lat, lng]);
    setMapZoom(8);
    // Auto-select closest station
    if (filteredStations.length > 0) {
      const closest = filteredStations
        .map(station => ({
          station,
          distance: calculateDistance(lat, lng, station.latitude, station.longitude)
        }))
        .sort((a, b) => a.distance - b.distance)[0];

      setSelectedStation(closest.station);
      onSelect(closest.station);
    }
  };

  const handleStationSelect = (station: typeof mockWeatherStations[0]) => {
    setSelectedStation(station);
    setMapCenter([station.latitude, station.longitude]);
    setMapZoom(10);
    onSelect(station);
  };

  // Get unique sources
  const sources = ['All', ...Array.from(new Set(mockWeatherStations.map(s => s.source)))];

  return (
    <div className="flex gap-lg h-full">
      {/* Map - Left side */}
      <div className="flex-1">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%', minHeight: '500px' }}
          className="rounded border border-greylight"
        >
          <MapClickHandler onRightClick={handleRightClick} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User marker */}
          {userMarker && (
            <Marker
              position={[userMarker.lat, userMarker.lng]}
              icon={UserMarkerIcon}
            >
              <Popup>
                <div>
                  <strong>Your Location</strong>
                  <br />
                  Lat: {userMarker.lat.toFixed(2)}°
                  <br />
                  Lon: {userMarker.lng.toFixed(2)}°
                </div>
              </Popup>
            </Marker>
          )}

          {/* Weather station markers */}
          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              eventHandlers={{
                click: () => handleStationSelect(station),
              }}
            >
              <Popup>
                <div>
                  <strong>{station.city}, {station.country}</strong>
                  <br />
                  Elevation: {station.elevation}m
                  <br />
                  Source: {station.source}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <p className="text-xs text-greydark mt-sm">
          Right-click on map to place marker and find closest climate stations
        </p>
      </div>

      {/* Location Details - Right side */}
      <div className="w-[380px] space-y-md overflow-y-auto">
        <h3 className="text-sm font-semibold uppercase text-greydark">Location Selection</h3>

        <Select
          label="Region/Continent"
          value={selectedRegion}
          onChange={(value) => setSelectedRegion(value)}
          options={[
            { value: 'USA, North America', label: 'USA, North America' },
            { value: 'Europe', label: 'Europe' },
          ]}
        />

        <Select
          label="Source Catalogue"
          value={selectedSource}
          onChange={(value) => setSelectedSource(value)}
          options={sources.map(s => ({ value: s, label: s }))}
        />

        <div>
          <Label htmlFor="city-search">City Search</Label>
          <Input
            id="city-search"
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search city or location..."
          />
        </div>

        {/* User Marker Info */}
        {userMarker && (
          <div className="bg-red/10 border border-red rounded p-sm space-y-xs">
            <h4 className="text-xs font-semibold uppercase text-greydark">Your Marker</h4>
            <div className="text-xs grid grid-cols-2 gap-xs">
              <div>
                <span className="text-greydark">Latitude:</span>
                <div className="font-mono">{userMarker.lat.toFixed(2)}°</div>
              </div>
              <div>
                <span className="text-greydark">Longitude:</span>
                <div className="font-mono">{userMarker.lng.toFixed(2)}°</div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Station Info */}
        {selectedStation && (
          <div className="bg-bluegreen/10 border border-bluegreen rounded p-sm space-y-xs">
            <h4 className="text-xs font-semibold uppercase text-greydark">Selected Climate Station</h4>
            <div className="text-sm font-medium">{selectedStation.city}, {selectedStation.country}</div>
            <div className="text-xs">
              <div className="text-greydark">{selectedStation.comment}</div>
            </div>
            <div className="text-xs grid grid-cols-2 gap-xs mt-sm">
              <div>
                <span className="text-greydark">Latitude:</span>
                <div className="font-mono">{selectedStation.latitude.toFixed(2)}°</div>
              </div>
              <div>
                <span className="text-greydark">Longitude:</span>
                <div className="font-mono">{Math.abs(selectedStation.longitude).toFixed(2)}° {selectedStation.longitude < 0 ? 'W' : 'E'}</div>
              </div>
              <div>
                <span className="text-greydark">Elevation:</span>
                <div className="font-mono">{selectedStation.elevation}m</div>
              </div>
              <div>
                <span className="text-greydark">Source:</span>
                <div className="font-mono">{selectedStation.source}</div>
              </div>
            </div>
            {userMarker && (
              <div className="text-xs mt-sm pt-sm border-t border-bluegreen/30">
                <span className="text-greydark">Distance from marker:</span>
                <div className="font-mono font-semibold">
                  {calculateDistance(
                    userMarker.lat,
                    userMarker.lng,
                    selectedStation.latitude,
                    selectedStation.longitude
                  ).toFixed(1)} km
                </div>
              </div>
            )}
          </div>
        )}

        {/* Closest Stations List */}
        {closestStations.length > 0 && (
          <div className="space-y-xs">
            <h4 className="text-xs font-semibold uppercase text-greydark">
              10 Closest Climate Stations ({closestStations.length} found)
            </h4>
            <div className="space-y-xs max-h-[300px] overflow-y-auto">
              {closestStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => handleStationSelect(station)}
                  className={`w-full text-left p-sm rounded border transition-colors ${
                    selectedStation?.id === station.id
                      ? 'bg-bluegreen/20 border-bluegreen'
                      : 'bg-white border-greylight hover:bg-greylight/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{station.city}</div>
                      <div className="text-xs text-greydark">{station.comment}</div>
                      <div className="text-xs text-greydark mt-xs">
                        {station.latitude.toFixed(2)}°, {station.longitude.toFixed(2)}° · {station.elevation}m
                      </div>
                    </div>
                    <div className="text-right ml-sm">
                      <div className="text-xs font-mono font-semibold">{station.distance.toFixed(1)} km</div>
                      <div className="text-xs text-greydark">{station.source}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Stations (when no marker placed) */}
        {!userMarker && filteredStations.length > 0 && (
          <div className="space-y-xs">
            <h4 className="text-xs font-semibold uppercase text-greydark">
              Available Climate Stations ({filteredStations.length} found)
            </h4>
            <div className="space-y-xs max-h-[400px] overflow-y-auto">
              {filteredStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => handleStationSelect(station)}
                  className={`w-full text-left p-sm rounded border transition-colors ${
                    selectedStation?.id === station.id
                      ? 'bg-bluegreen/20 border-bluegreen'
                      : 'bg-white border-greylight hover:bg-greylight/10'
                  }`}
                >
                  <div className="text-sm font-medium">{station.city}, {station.country}</div>
                  <div className="text-xs text-greydark">{station.comment}</div>
                  <div className="text-xs text-greydark mt-xs">
                    {station.latitude.toFixed(2)}°, {station.longitude.toFixed(2)}° · {station.elevation}m · {station.source}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
