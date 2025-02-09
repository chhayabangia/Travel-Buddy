// Fetch weather data from OpenWeatherMap API

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const getWeatherByCity = async (city: string) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const weatherData = await response.json();
    return {
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return { error: 'Could not retrieve weather data' };
  }
};
