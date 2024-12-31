import { useState } from 'react';
import { Home, Building2, MapPin } from 'lucide-react';
import { Address, Location } from '../types';
import Map from './Map';

interface AddressFormProps {
  onSubmit: (address: Omit<Address, 'id'>) => void;
  onCancel?: () => void;
  initialAddress?: Address;
}

export default function AddressForm({ onSubmit, onCancel, initialAddress }: AddressFormProps) {
  const [formData, setFormData] = useState({
    title: initialAddress?.title || '',
    category: initialAddress?.category || 'home',
    address: initialAddress?.address || '',
    details: initialAddress?.details || '',
    location: initialAddress?.location || { lat: 0, lng: 0 },
    isFavorite: initialAddress?.isFavorite || false,
  });

  const handleLocationSelect = (location: Location, address?: string) => {
    setFormData(prev => ({
      ...prev,
      location,
      address: address || prev.address
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <Map onLocationSelect={handleLocationSelect} initialLocation={formData.location} />

      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Location Name
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, category: 'home' }))}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                formData.category === 'home'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, category: 'office' }))}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                formData.category === 'office'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Office
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, category: 'other' }))}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                formData.category === 'other'
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-5 h-5" />
              Other
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details
          </label>
          <input
            type="text"
            id="details"
            value={formData.details}
            onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
            placeholder="Apartment number, floor, landmark, etc."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="favorite"
            checked={formData.isFavorite}
            onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
          />
          <label htmlFor="favorite" className="ml-2 text-sm text-gray-700">
            Save as favorite
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 py-3 px-6 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
        >
          {initialAddress ? 'Update Address' : 'Save Address'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}