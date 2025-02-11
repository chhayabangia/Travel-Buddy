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

/* Alex - I tried figuring out the API already made and ran into multiple issues so I went back to the
amadeus API and having better luck. Maybe it's because I already learned a lot from their website who
knows. But what I do know now after doing research in comparisons of other APIs to amadeus, amadeus
provides faster calling and has no limits compared to Skyscanner and the IATA codes are directly supported
by amadeus plus we wont need to have an extra function/step to fetch IDs (skyId). I am going to integrate
more of the amadeus in a separate file so that incase y'all decide to go back or have any updates to this
file it is readily available. */

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
    console.log("🛫 Searching flights...");
    console.log("🛫 Origin Coordinates:", originCoords);
    console.log("🛬 Destination Coordinates:", destinationCoords);
    console.log("📅 Departure Date:", departureDate);
    console.log("🔑 Using API Key:", process.env.RAPIDAPI_KEY ? "✅ Loaded" : "❌ NOT Loaded");

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
    
    console.log("🔄 API Response Status:", response.status);

    if (!response.ok) throw new Error(`Failed to fetch flights: ${response.statusText}`);

    const data = (await response.json()) as unknown as FlightResponse;
    console.log("✅ API Response Data:", data);

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
