import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface WeatherData {
  temperature: number;
  description: string;
  date?: string;
}

// Generic function to fetch data from OpenWeather API
const fetchFromAPI = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
};

// Fetch coordinates (lat/lon) for a city, state, and country
export const getCoordinates = async (location: string): Promise<Coordinates> => {
  console.log("🔍 Fetching coordinates for:", location);

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenWeather API key");

  const locationParts = location.split(",");
  if (locationParts.length !== 3) {
    console.error("❌ Invalid location format:", location);
    throw new Error("Invalid location format. Use 'City,State,Country'.");
  }

  const [city, state, country] = locationParts.map((part) => part.trim());
  console.log("📌 Parsed Location → City:", city, "| State:", state, "| Country:", country);

  const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(state)},${encodeURIComponent(country)}&appid=${apiKey}`;
  console.log("🌍 API URL:", apiUrl);
  
  const data = await fetchFromAPI(apiUrl);
  console.log("📍 API Response Data:", data);
  
  if (data.length === 0) throw new Error("City not found.");

  return { lat: data[0].lat, lon: data[0].lon };
};

// Fetch current weather using coordinates
const getCurrentWeather = async (coordinates: Coordinates): Promise<WeatherData> => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  const data = await fetchFromAPI(url);
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
  };
};

//Fetch 5-day forecast
const getForecast = async (coordinates: Coordinates): Promise<WeatherData[]> => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  const data = await fetchFromAPI(url);

  return data.list
    .filter((entry: any) => entry.dt_txt.includes("12:00:00"))
    .map((entry: any) => ({
      temperature: entry.main.temp,
      description: entry.weather[0].description,
      date: entry.dt_txt.split(" ")[0], 
    }));
};

// Fetch full weather data for destination
export const getWeatherByCity = async (destination: string) => {
  try {
    const coordinates = await getCoordinates(destination);
    const currentWeather = await getCurrentWeather(coordinates);
    const forecast = await getForecast(coordinates);

    return { coordinates, currentWeather, forecast };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return { error: "Could not retrieve weather data" };
  }
};
