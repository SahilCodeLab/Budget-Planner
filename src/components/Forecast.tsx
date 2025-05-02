
import { ForecastData, getWeatherIcon, groupForecastByDay } from '@/utils/weatherApi';
import { Card, CardContent } from '@/components/ui/card';

interface ForecastProps {
  forecastData: ForecastData | null;
  isLoading: boolean;
}

const Forecast = ({ forecastData, isLoading }: ForecastProps) => {
  if (isLoading) {
    return (
      <Card className="weather-card">
        <div className="flex space-x-4 overflow-x-auto py-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse flex-shrink-0 w-32">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!forecastData) return null;

  const dailyForecast = groupForecastByDay(forecastData).slice(0, 5);

  return (
    <Card className="weather-card">
      <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {dailyForecast.map((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return (
              <div key={index} className="forecast-card flex flex-col items-center">
                <div className="font-medium">{dayName}</div>
                <div className="text-xs text-muted-foreground">{formattedDate}</div>
                <img 
                  src={getWeatherIcon(day.weather.icon)} 
                  alt={day.weather.description} 
                  className="w-16 h-16 my-2 animate-float"
                />
                <div className="flex space-x-2 text-sm">
                  <span className="font-medium">{Math.round(day.temp_max)}°</span>
                  <span className="text-muted-foreground">{Math.round(day.temp_min)}°</span>
                </div>
                <div className="text-xs capitalize mt-1">{day.weather.description}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Forecast;
