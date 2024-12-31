import { Settings } from 'lucide-react';
import Modal from './Modal';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationPermissionModal({ isOpen, onClose }: LocationPermissionModalProps) {
  const openSettings = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          window.open('chrome://settings/content/location', '_blank');
        }
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Location Access Required"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          To use the location features, please enable location access in your browser settings.
          This helps us provide accurate location-based services.
        </p>
        
        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Settings className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-indigo-900">How to enable?</h3>
            <p className="text-sm text-indigo-700">
              Click the lock icon in your browser's address bar and allow location access
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={openSettings}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Open Settings
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
}