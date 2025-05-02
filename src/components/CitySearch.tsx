
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface CitySearchProps {
  onSearch: (city: string) => void;
}

const CitySearch = ({ onSearch }: CitySearchProps) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <Input
        placeholder="Search for a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="bg-weather-purple hover:bg-weather-purple/90">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default CitySearch;
