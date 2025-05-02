
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
  };
  dt: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getStoredApiKey = (): string => {
  return localStorage.getItem('weatherApiKey') || '';
};

export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem('weatherApiKey', apiKey);
};

export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error('API key is required');
  
  const response = await fetch(
    `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchForecast = async (city: string): Promise<ForecastData> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error('API key is required');
  
  const response = await fetch(
    `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }
  
  return response.json();
};

export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const groupForecastByDay = (forecast: ForecastData) => {
  const dailyData: Record<string, any> = {};

  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!dailyData[date]) {
      dailyData[date] = {
        dt: item.dt,
        date,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0],
        humidity: item.main.humidity,
        wind_speed: 0,
      };
    } else {
      // Update min/max temperatures
      dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
      dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
      
      // Take the noon forecast as representative for the day
      const hour = new Date(item.dt * 1000).getHours();
      if (hour >= 11 && hour <= 14) {
        dailyData[date].weather = item.weather[0];
      }
    }
  });
  
  // Return as array, sorted by date
  return Object.values(dailyData).sort((a, b) => a.dt - b.dt);
};
