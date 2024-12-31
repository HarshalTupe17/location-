export interface Location {
  lat: number;
  lng: number;
}

export interface Address {
  id: string;
  title: string;
  category: 'home' | 'office' | 'other';
  location: Location;
  address: string;
  details?: string;
  isFavorite: boolean;
}