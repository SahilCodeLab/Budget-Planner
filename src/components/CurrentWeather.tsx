
import { Card, CardContent } from '@/components/ui/card';
import { WeatherData, getWeatherIcon } from '@/utils/weatherApi';
import { Cloud, CloudRain, CloudSnow, Sun, Thermometer } from 'lucide-react';

interface CurrentWeatherProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

const WeatherIcon = ({ type }: { type: string }) => {
  const iconMap = {
    'Clear': <Sun className="h-12 w-12 text-yellow-500" />,
    'Clouds': <Cloud className="h-12 w-12 text-slate-400" />,
    'Rain': <CloudRain className="h-12 w-12 text-blue-400" />,
    'Snow': <CloudSnow className="h-12 w-12 text-slate-300" />,
    'default': <Thermometer className="h-12 w-12 text-red-400" />
  };
  
  return iconMap[type as keyof typeof iconMap] || iconMap.default;
};

const CurrentWeather = ({ weatherData, isLoading }: CurrentWeatherProps) => {
  if (isLoading) {
    return (
      <Card className="weather-card animate-pulse">
        <div className="h-44 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-200"></div>
        </div>
      </Card>
    );
  }

  if (!weatherData) return null;

  const { name, main, weather, wind, sys } = weatherData;
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const getBackgroundClass = () => {
    const type = weather[0]?.main;
    const bgMap: Record<string, string> = {
      'Clear': 'from-weather-sunny to-white',
      'Clouds': 'from-weather-cloudy to-white',
      'Rain': 'from-weather-rainy to-white',
      'Snow': 'from-weather-snowy to-white',
      'default': 'from-weather-light-blue to-weather-light-purple'
    };
    
    return `bg-gradient-to-br ${bgMap[type] || bgMap.default}`;
  };

  return (
    <Card className={`weather-card overflow-hidden ${getBackgroundClass()}`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 flex flex-col items-center justify-center md:items-start">
            <div className="mb-2">
              <h2 className="text-3xl font-bold mb-1">
                {name}, {sys.country}
              </h2>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="mr-4">
                <WeatherIcon type={weather[0]?.main} />
              </div>
              <div>
                <p className="text-5xl font-bold">{Math.round(main.temp)}°C</p>
                <p className="text-sm capitalize">{weather[0]?.description}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/5 p-6 w-full md:w-auto md:flex-1">
            <h3 className="font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Feels like</p>
                <p className="font-medium">{Math.round(main.feels_like)}°C</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-medium">{main.humidity}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="font-medium">{wind.speed} m/s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="font-medium">{main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
