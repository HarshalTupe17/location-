import { MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-12 px-6 rounded-2xl mb-8">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] opacity-10 bg-cover bg-center" />
      <div className="relative animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl shadow-lg">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100">
              Delivery Location Manager
            </h1>
            <p className="text-indigo-100 mt-2 text-lg">
              Manage your delivery addresses with style and ease
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}