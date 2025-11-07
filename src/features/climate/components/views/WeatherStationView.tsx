import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherStationViewProps {
  onSelect: (location: LocationSearchResult) => void;
}

// Mock weather station data
const mockWeatherStations: LocationSearchResult[] = [
  {
    id: 'albany-ny',
    city: 'Albany',
    country: 'USA',
    latitude: 42.65,
    longitude: -73.75,
    elevation: 100,
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
    availableDatasets: [{
      id: 'typical-year',
      source: 'DWD',
      period: { start: '2010-01-01', end: '2019-12-31' },
      dataQuality: 'measured'
    }]
  },
];

// Component to handle map view changes
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export function WeatherStationView({ onSelect }: WeatherStationViewProps) {
  const [selectedRegion, setSelectedRegion] = useState('USA, North America');
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(mockWeatherStations[0]);
  const [selectedDataset, setSelectedDataset] = useState('cold year');
  const [mapCenter, setMapCenter] = useState<[number, number]>([42.65, -73.75]);
  const [mapZoom, setMapZoom] = useState(4);
  const [comment, setComment] = useState('Oak Ridge National Laboratory, USA');

  // Filter stations by region
  const filteredStations = selectedRegion === 'USA, North America'
    ? mockWeatherStations.filter(s => s.country === 'USA')
    : mockWeatherStations.filter(s => s.country !== 'USA');

  const handleLocationChange = (locationId: string) => {
    const location = mockWeatherStations.find(s => s.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setMapCenter([location.latitude, location.longitude]);
      setMapZoom(6);
    }
  };

  const handleMarkerClick = (station: LocationSearchResult) => {
    setSelectedLocation(station);
    setMapCenter([station.latitude, station.longitude]);
    setMapZoom(8);
  };

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
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockWeatherStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              eventHandlers={{
                click: () => handleMarkerClick(station),
              }}
            >
              <Popup>
                <div>
                  <strong>{station.city}, {station.country}</strong>
                  <br />
                  Elevation: {station.elevation}m
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Location Details - Right side */}
      <div className="w-[320px] space-y-md">
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
          label="Location"
          value={selectedLocation?.id || ''}
          onChange={(value) => handleLocationChange(value)}
          options={filteredStations.map(station => ({
            value: station.id,
            label: `${station.city}, ${station.country}`
          }))}
        />

        <Select
          label="Dataset"
          value={selectedDataset}
          onChange={(value) => setSelectedDataset(value)}
          options={[
            { value: 'cold year', label: 'cold year' },
            { value: 'typical year', label: 'typical year' },
            { value: 'warm year', label: 'warm year' },
          ]}
        />

        {selectedLocation && (
          <>
            <div className="grid grid-cols-2 gap-sm text-sm">
              <div>
                <div className="text-greydark">Geographic Latitude [°]:</div>
                <div className="font-mono">{selectedLocation.latitude.toFixed(2)} North</div>
              </div>
              <div>
                <div className="text-greydark">Geographic Longitude [°]:</div>
                <div className="font-mono">{Math.abs(selectedLocation.longitude).toFixed(2)} {selectedLocation.longitude < 0 ? 'West' : 'East'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-sm text-sm">
              <div>
                <div className="text-greydark">Altitude [m]:</div>
                <div className="font-mono">{selectedLocation.elevation}</div>
              </div>
              <div>
                <div className="text-greydark">Time Zone [hours from UTC]:</div>
                <div className="font-mono">-5.0</div>
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Location description"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
