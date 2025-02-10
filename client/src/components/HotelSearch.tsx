import { useState } from "react";
import "../css/HotelSearch.css";

// Predefined city mappings
const cityMappings: { [key: string]: string } = {
  "new york": "New York",
  "los angeles": "Los Angeles",
  "chicago": "Chicago",
  "miami": "Miami",
  "houston": "Houston",
  "san francisco": "San Francisco",
  "las vegas": "Las Vegas",
  "orlando": "Orlando",
  "boston": "Boston",
  "seattle": "Seattle",
};

const cityOptions = Object.values(cityMappings);

const HotelSearch = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  // Handle city input with auto-correction & auto-suggestions
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    setCity(input);

    const lowerCaseInput = input.trim().toLowerCase(); // Convert input to lowercase
    console.log("🔎 User Input:", input);
    console.log("🔎 Lowercase Input:", lowerCaseInput);

    if (cityMappings.hasOwnProperty(lowerCaseInput)) {
      console.log("✅ City Found in Mappings:", cityMappings[lowerCaseInput]);
      setCity(cityMappings[lowerCaseInput]); 
      setFilteredCities([]);
    } else {
      console.log("❌ City Not Found! Showing suggestions...");
      setFilteredCities(
        cityOptions.filter((c) => c.toLowerCase().startsWith(lowerCaseInput))
      );
    }    
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setFilteredCities([]); // Hide dropdown after selection
  };

  const fetchCityCode = async (cityName: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cities/search?city=${cityName}`);
      const data = await response.json();
  
      if (data && data.length > 0) {
        return data[0].iataCode; // Use the first match
      }
    } catch (error) {
      console.error("❌ Error fetching city code:", error);
    }
    return null; // Return null if no match is found
  };

  // ✅ Ensure search function is properly defined
  const searchHotels = async () => {
    setLoading(true);
    setError(""); 
    setHotels([]);

    const lowerCaseCity = city.trim().toLowerCase();
    let cityCode = cityMappings[city.trim().toLowerCase()] || "";

    if (!cityCode) {
      cityCode = await fetchCityCode(city.trim()); // 🔹 Now fetches city code dynamically
    }
  
    console.log("🔎 Final City Code:", cityCode);

    console.log("🔎 Searching for:", city);
    console.log("🔎 Lowercase City:", lowerCaseCity);
    console.log("🔎 Mapped City Code:", cityCode);

    if (!cityCode) {
        console.log("❌ No city code found! Showing error message...");
        setError("Please select a valid city from the dropdown.");
        setLoading(false);
        return;
    }

    try {
        console.log("🚀 Sending API Request...");
        const response = await fetch(`http://localhost:5000/api/hotels/search?cityCode=${cityCode}`);
        console.log("✅ API Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API Response Data:", data);

        if (!data || data.length === 0) {
            console.log("❌ No hotels found. Updating error state.");
            setError("No hotels found. Try another search.");
            setHotels([]);
        } else {
            console.log("✅ Hotels found! Updating state.");
            setError(""); 
            setHotels(data.slice(0, 10)); 
        }
    } catch (err) {
        console.error("❌ Error fetching hotels:", err);
        setError("Failed to fetch hotels. Please try again.");
    }
    setLoading(false);
};


return (
  <div className="hotel-search">
    <h2>🏨 Find Your Stay</h2>
    <div className="search-bar">
      <div className="autocomplete">
        <label htmlFor="destination">Destination:</label>
        <input
          id="destination"
          type="text"
          placeholder="Enter city (e.g., New York)"
          aria-label="Destination City"
          title="Enter the name of the city"
          value={city}
          onChange={handleCityChange}
        />
        {filteredCities.length > 0 && (
          <ul className="autocomplete-list">
            {filteredCities.map((c, index) => (
              <li key={index} onClick={() => handleCitySelect(c)}>
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      <label htmlFor="check-in">Check-in:</label>
      <input type="date" id="check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />

      <label htmlFor="check-out">Check-out:</label>
      <input type="date" id="check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />

      <label htmlFor="guests">Guests:</label>
      <select
        id="guests"
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        aria-label="Number of guests"
        title="Select number of guests"
      >
        {[...Array(10).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1} Guest{num > 0 ? "s" : ""}
          </option>
        ))}
      </select>

      <button onClick={searchHotels} disabled={loading} aria-label="Search Hotels" title="Click to search for hotels">
        {loading ? "Searching..." : "🔍 Search"}
      </button>
    </div>

    {error && <p className="error-message">{error}</p>}

    {/* ✅ Fallback Message: If no hotels are found */}
    {!loading && hotels.length === 0 && !error && (
      <p className="no-results">No results found. Try another search.</p>
    )}

    <ul className="hotel-list">
      {hotels.map((hotel, index) => (
        <li key={index} className="hotel-item">
          <h3>{hotel.name || "No Name Available"}</h3>
          <p>{hotel.address?.countryCode || "No Address Available"}</p>
          <p>
            Coordinates: {hotel.geoCode?.latitude ?? "N/A"}, {hotel.geoCode?.longitude ?? "N/A"}
          </p>
        </li>
      ))}
    </ul>
  </div>
);
};

export default HotelSearch;
