import { Home, Building2, MapPin, Star, Trash2, Edit } from 'lucide-react';
import { Address } from '../types';

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
  onEdit: (address: Address) => void;
}

const categoryIcons = {
  home: Home,
  office: Building2,
  other: MapPin,
};

const categoryStyles = {
  home: 'bg-indigo-50 text-indigo-600',
  office: 'bg-purple-50 text-purple-600',
  other: 'bg-pink-50 text-pink-600',
};

export default function AddressCard({ address, onDelete, onEdit }: AddressCardProps) {
  const Icon = categoryIcons[address.category];

  return (
    <div className="animate-slideIn group glass-effect rounded-xl hover:shadow-xl transition-all duration-300 p-5">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${categoryStyles[address.category]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-lg">{address.title}</h3>
              {address.isFavorite && (
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-scaleIn" />
              )}
            </div>
            <p className="text-gray-600 mt-2">{address.address}</p>
            {address.details && (
              <p className="text-gray-500 text-sm mt-2 italic">{address.details}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={() => onEdit(address)}
            className="p-2 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit address"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            title="Delete address"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}