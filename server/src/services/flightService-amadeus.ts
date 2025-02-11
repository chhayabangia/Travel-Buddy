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
export const getNearestAirport = async (city: string): Promise<string | null> => {

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

    // Ensure departure date is always in the future (based on UTC time)
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (departureDate <= todayStr) {
      console.warn(`⚠️ Adjusting departure date: ${departureDate} is in the past. Using ${todayStr} instead.`);
      departureDate = todayStr;
    }

    console.log(`🟡 Adjusted Departure Date: ${departureDate}`);

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
    console.log("🟡 Raw Amadeus API Response:", JSON.stringify(data, null, 2));

    if (!data.data || data.data.length === 0) {
      console.warn("⚠️ No flights found.");
      return [];
    }

    return data.data.map((flight: any) => {
      const segments = flight.itineraries?.[0]?.segments?.[0] || {};
      return {
        flightNumber: segments.number || "N/A",
        airline: segments.carrierCode || "Unknown Airline",
        price: flight.price?.total || "0",
        departureTime: segments.departure?.at || "N/A",
        arrivalTime: segments.arrival?.at || "N/A",
      };
    });
  } catch (error) {
    console.error("❌ Error fetching flights from Amadeus:", error);
    return [];
  }
};
