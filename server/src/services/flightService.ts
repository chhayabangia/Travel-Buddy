/* Series of functions to fetch flight data from the RapidAPI Flights Scraper API
** Need to get skyID for origin & destination
GET https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=New%20York
  Returns: "skyId": "NYCA"
GET https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=Dallas
  Returns: "skyId": "DFWA"
** Need following perams for round trip flight search:
  - fromEntityId (skyId for origin)
  - toEntityId (skyId for destination)
  - departDate
  - returnDate
GET https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=DFWA&toEntityId=NYCA&departDate=2025-03-01&returnDate=2025-03-15
  - If status shows as incomplete need to use "search-incomplete" endpoint with the sessionID until results show as complete
GET https://sky-scanner3.p.rapidapi.com/flights/search-incomplete?sessionId=ClsIARJXCk4KJGE5OTBjNmI0LTIxNTQtNGJlMS05MWMwLTM5MDgxYzlhZTE3NRACGiQ4ZjE0OTVmMy02Y2ZjLTQxZWItOGNiMS0yMzRlZmJmMjk5MzgQs6-I2s4yEih1c3NfNmI1MWIzMTMtOTM3Ni00Y2QyLTk3YTYtNGQ5YzQ1MGY1N2EyIgJVUw%3D%3D
** Then need to figure out how to ID 5 flights to display
** Maybe for now we do cheapest one way flight for sake of simple data extraction
GET https://sky-scanner3.p.rapidapi.com/flights/cheapest-one-way?fromEntityId=DFWA&toEntityId=JFK&departDate=2025-02-28
*/

import fetch from "node-fetch";
import dotenv from "dotenv";

interface FlightResponse {
  flights: any[];
}

dotenv.config();

interface Flight {
  flightNumber: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

//Fetch flights using origin & destination coordinates
export const searchFlights = async (
  originCoords: { lat: number, lon: number },
  destinationCoords: { lat: number, lon: number },
  departureDate: string,
  returnDate?: string
): Promise<Flight[]> => {
  try {
    const response = await fetch("https://flights-scraper-api.p.rapidapi.com/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "flights-scraper-api.p.rapidapi.com",
      },
      body: JSON.stringify({
        origin: `${originCoords.lat},${originCoords.lon}`,
        destination: `${destinationCoords.lat},${destinationCoords.lon}`,
        departureDate,
        returnDate: returnDate || null,
        passengers: 1,
        currency: "USD",
      }),
    });

    if (!response.ok) throw new Error(`Failed to fetch flights: ${response.statusText}`);

    const data = (await response.json()) as unknown as FlightResponse;
    return data.flights.slice(0, 5).map((flight: any) => ({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      price: flight.price.total,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
    }));
  } catch (error) {
    console.error("Error fetching flights:", error);
    return [];
  }
};
