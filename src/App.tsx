import React, { useState, useEffect } from 'react';
import { Address } from './types';
import AddressForm from './components/AddressForm';
import AddressCard from './components/AddressCard';
import Header from './components/Header';
import { toast, Toaster } from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

function App() {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const savedAddresses = localStorage.getItem('addresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [];
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const handleAddAddress = (newAddress: Omit<Address, 'id'>) => {
    const address: Address = {
      ...newAddress,
      id: crypto.randomUUID(),
    };
    setAddresses(prev => [...prev, address]);
    setIsAddingNew(false);
    toast.success('Address saved successfully!', {
      icon: '🎉',
      style: {
        borderRadius: '1rem',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleUpdateAddress = (updatedAddress: Omit<Address, 'id'>) => {
    if (!editingAddress) return;
    
    setAddresses(prev =>
      prev.map(addr =>
        addr.id === editingAddress.id
          ? { ...updatedAddress, id: addr.id }
          : addr
      )
    );
    setEditingAddress(null);
    toast.success('Address updated successfully!', {
      icon: '✨',
      style: {
        borderRadius: '1rem',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success('Address deleted successfully!', {
      icon: '🗑️',
      style: {
        borderRadius: '1rem',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Header />
        
        {!isAddingNew && !editingAddress && (
          <button
            onClick={handleAddNewClick}
            className="w-full mb-8 flex items-center justify-center gap-3 py-4 px-6 glass-effect rounded-xl text-indigo-600 hover:text-indigo-700 hover:shadow-lg transition-all duration-300 group"
          >
            <Plus className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300" />
            <span className="text-lg font-medium">Add New Address</span>
          </button>
        )}

        {isAddingNew && (
          <div className="glass-effect rounded-xl p-6 mb-8 animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Address
              </h2>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AddressForm
              onSubmit={handleAddAddress}
              onCancel={() => setIsAddingNew(false)}
            />
          </div>
        )}

        {editingAddress && (
          <div className="glass-effect rounded-xl p-6 mb-8 animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit Address
              </h2>
              <button
                onClick={() => setEditingAddress(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AddressForm
              initialAddress={editingAddress}
              onSubmit={handleUpdateAddress}
              onCancel={() => setEditingAddress(null)}
            />
          </div>
        )}

        {addresses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Saved Addresses
            </h2>
            <div className="space-y-4">
              {addresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onDelete={handleDeleteAddress}
                  onEdit={setEditingAddress}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;