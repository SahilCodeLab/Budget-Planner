
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ApiKeyForm from '@/components/ApiKeyForm';
import CitySearch from '@/components/CitySearch';
import CurrentWeather from '@/components/CurrentWeather';
import Forecast from '@/components/Forecast';
import {
  WeatherData,
  ForecastData,
  fetchCurrentWeather,
  fetchForecast,
  getStoredApiKey,
} from '@/utils/weatherApi';

const Index = () => {
  const { toast } = useToast();
  const [apiKeySet, setApiKeySet] = useState(false);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKeySet(true);
      // Set a default city for initial load if API key is already set
      fetchWeatherForCity('London');
    }
  }, []);

  const fetchWeatherForCity = async (cityName: string) => {
    setIsLoading(true);
    setCity(cityName);
    
    try {
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch weather data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySet = () => {
    setApiKeySet(true);
    fetchWeatherForCity('London'); // Default city
  };

  const handleSearch = (cityName: string) => {
    fetchWeatherForCity(cityName);
  };

  return (
    <div className="min-h-screen weather-gradient">
      <div className="container py-8 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Cloud Chaser</h1>
          <p className="text-lg text-muted-foreground">
            Your personal weather dashboard
          </p>
        </header>
        
        {!apiKeySet ? (
          <ApiKeyForm onApiKeySet={handleApiKeySet} />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CitySearch onSearch={handleSearch} />
            </div>
            
            {city && (
              <>
                <CurrentWeather weatherData={weatherData} isLoading={isLoading} />
                <Forecast forecastData={forecastData} isLoading={isLoading} />
              </>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Data provided by{" "}
                <a 
                  href="https://openweathermap.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-weather-purple underline"
                >
                  OpenWeatherMap
                </a>
              </p>
              <button 
                className="mt-2 text-sm text-muted-foreground underline"
                onClick={() => setApiKeySet(false)}
              >
                Update API Key
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
