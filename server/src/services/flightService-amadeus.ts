import fetch from "node-fetch";

interface AirportSearchResponse {
  data: { iataCode: string }[];
}

interface FlightSearchResponse {
  data: {
    itineraries: { segments: { marketingCarrier: string; carrierCode: string; departure: { at: string }; arrival: { at: string } }[] }[];
    price: { total: string };
  }[];
}

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY || "";
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET || "";
let accessToken = "";

// 🔹 Fetch Amadeus Access Token
const getAccessToken = async (): Promise<string | null> => {
    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
      console.error("❌ Amadeus API credentials are missing.");
      return null;
    }
  
    try {
      const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: AMADEUS_API_KEY,
          client_secret: AMADEUS_API_SECRET,
        }),
      });
  
      const data = (await response.json()) as { access_token: string };
      accessToken = data.access_token;
      console.log("✅ Amadeus Access Token Retrieved");
      return accessToken;
    } catch (error) {
      console.error("❌ Error fetching Amadeus token:", error);
      return null;
    }
};

// 🔹 Get Nearest Airport for a City
const getNearestAirport = async (city: string) => {
  if (!accessToken) await getAccessToken();

  try {
    console.log(`🔍 Searching for the nearest airport for: ${city}`);
    
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(city)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as AirportSearchResponse;
    
    if (!data.data || data.data.length === 0) {
      console.warn(`⚠️ No airports found for city: ${city}`);
      return null;
    }

    const airportCode = data.data[0].iataCode; // Get the first airport match
    console.log(`✅ Nearest Airport for ${city}: ${airportCode}`);
    return airportCode;
  } catch (error) {
    console.error(`❌ Error fetching airport for city: ${city}`, error);
    return null;
  }
};

// 🔹 Search for Flights
export const searchFlights = async (origin: string, destination: string, departureDate: string) => {
  if (!accessToken) await getAccessToken();

  try {
    console.log(`🛫 Searching Amadeus Flights: ${origin} → ${destination} on ${departureDate}`);

    const originCode = await getNearestAirport(origin) || origin;
    const destinationCode = await getNearestAirport(destination) || destination;

    if (!originCode || !destinationCode) {
      throw new Error(`Could not find airport codes for: ${origin} or ${destination}`);
    }

    console.log(`✈️ Using Airport Codes: ${originCode} → ${destinationCode}`);

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${departureDate}&adults=1&nonStop=true&max=5`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as FlightSearchResponse;
    if (!data.data || data.data.length === 0) throw new Error("No flights found");
    
    console.log("🎯 Flight Results Received:", JSON.stringify(data, null, 2));

    return data.data.map((flight: any) => ({
      flightNumber: flight.itineraries[0]?.segments[0]?.marketingCarrier || "N/A",
      airline: flight.itineraries[0]?.segments[0]?.carrierCode || "Unknown Airline",
      price: flight.price?.total || "0",
      departureTime: flight.itineraries[0]?.segments[0]?.departure?.at || "N/A",
      arrivalTime: flight.itineraries[0]?.segments[0]?.arrival?.at || "N/A",
    }));
  } catch (error) {
    console.error("❌ Error fetching flights from Amadeus:", error);
    return [];
  }
};
