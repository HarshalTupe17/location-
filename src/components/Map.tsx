import { useCallback, useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Location } from '../types';
import { GOOGLE_MAPS_API_KEY, defaultMapCenter, mapStyles } from '../config/maps';
import LocationPermissionModal from './LocationPermissionModal';

interface MapProps {
  onLocationSelect: (location: Location, address?: string) => void;
  initialLocation?: Location;
}

export default function Map({ onLocationSelect, initialLocation }: MapProps) {
  const [currentLocation, setCurrentLocation] = useState<Location>(
    initialLocation || defaultMapCenter
  );
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const getAddressFromLocation = useCallback(async (location: Location) => {
    if (!window.google?.maps) {
      console.error('Google Maps not loaded');
      onLocationSelect(location); // Fall back to just location without address
      return;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ 
        location: { lat: location.lat, lng: location.lng } 
      });
      
      if (response.results?.[0]) {
        const address = response.results[0].formatted_address;
        onLocationSelect(location, address);
      } else {
        onLocationSelect(location); // Fall back to just location if no address found
        console.warn('No address found for location');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      onLocationSelect(location); // Fall back to just location on error
      toast.error('Unable to get address for this location');
    }
  }, [onLocationSelect]);

  const onPlaceSelected = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCurrentLocation(newLocation);
      onLocationSelect(newLocation, place.formatted_address);
      mapRef.current?.panTo(newLocation);
      mapRef.current?.setZoom(17);
    }
  };

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Getting your location...', { id: 'location' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
        
        try {
          await getAddressFromLocation(newLocation);
          mapRef.current?.panTo(newLocation);
          mapRef.current?.setZoom(17);
          toast.success('Location found!', { id: 'location' });
        } catch (error) {
          toast.error('Error getting location details', { id: 'location' });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setShowPermissionModal(true);
          toast.error('Location permission denied', { id: 'location' });
        } else {
          toast.error('Unable to retrieve your location', { id: 'location' });
        }
      },
      { timeout: 10000 } // 10 second timeout
    );
  }, [getAddressFromLocation]);

  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setCurrentLocation(newLocation);
        await getAddressFromLocation(newLocation);
      }
    },
    [getAddressFromLocation]
  );

  return (
    <>
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg animate-scaleIn">
        <LoadScript 
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={['places', 'geocoding']}
        >
          <div className="absolute top-4 left-4 right-4 z-10">
            <Autocomplete
              onLoad={autocomplete => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={onPlaceSelected}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a location..."
                  className="w-full px-4 py-2 pl-10 bg-white rounded-xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </Autocomplete>
          </div>

          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={currentLocation}
            zoom={15}
            onClick={handleMapClick}
            options={mapStyles}
            onLoad={map => {
              mapRef.current = map;
            }}
          >
            <Marker position={currentLocation} />
          </GoogleMap>
        </LoadScript>
        
        <button
          onClick={handleLocateMe}
          className="absolute bottom-4 right-4 glass-effect px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-white/90 transition-all duration-300 text-indigo-600 hover:text-indigo-700"
        >
          <MapPin className="w-5 h-5" />
          Locate Me
        </button>
      </div>

      <LocationPermissionModal 
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />
    </>
  );
}