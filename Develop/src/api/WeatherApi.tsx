import dotenv from 'dotenv';
dotenv.config();
import { Router, type Request, type Response } from 'express';

interface Coordinates {
    lat: number;
    lon: number;
}

class Weather {
    city: string;
    date: string;
    icon: string;
    iconDescription: string;
    tempF: number;
    constructor(
        city: string,
        date: string,
        icon: string,
        iconDescription: string,
        tempF: number  
    ) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
    }
}

class WeatherService {
    private baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
    private apiKey = process.env.API_KEY || '';  

    private async fetchLocationData(query: string): Promise<any> {
        const url = this.buildGeocodeQuery(query);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        if (data.length === 0) {
            throw new Error('No location data found for the specified city');
        } 
        return data;
    }

    private destructureLocationData(locationData: any): Coordinates {
        const { lat, lon } = locationData[0];
        return { lat, lon };
    }

    private buildGeocodeQuery(query: string): string {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${this.apiKey}`;
    }

    private buildWeatherQuery(coordinates: Coordinates): string {
        return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    }  

    private async fetchAndDestructureLocationData(destination: string): Promise<Coordinates> {
        const locationData = await this.fetchLocationData(destination);
        return this.destructureLocationData(locationData);
    }

    private async fetchWeatherData(coordinates: Coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return response.json();
    }

    private formatDate(dateString: string): string { 
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    private parseCurrentWeather(response: any): Weather {
        const weather = response.list[0];
        return new Weather(
            response.city.name,
            this.formatDate(weather.dt_txt),
            weather.weather[0].icon,
            weather.weather[0].description,     
            weather.main.temp
        );
    }

    async getWeatherForCity(destination: string): Promise<Weather[]> {
        const coordinates = await this.fetchAndDestructureLocationData(destination);
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        return [currentWeather];
    }
}

export default new WeatherService();

const weatherRouter = Router();

weatherRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { destination } = req.body;
        if (!destination) {
            return res.status(400).json({ error: 'City name is required.' });
        }
        const weatherService = new WeatherService(); // Use an instance of WeatherService
        const weatherData = await weatherService.getWeatherForCity(destination);
        return res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data', error);
        return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export { weatherRouter };