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

    const lowerCaseInput = input.toLowerCase();
    if (cityMappings[lowerCaseInput]) {
      setCity(cityMappings[lowerCaseInput]); // Auto-correct
      setFilteredCities([]);
    } else {
      setFilteredCities(
        cityOptions.filter((c) => c.toLowerCase().startsWith(lowerCaseInput))
      );
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setFilteredCities([]); // Hide dropdown after selection
  };

  // ✅ Ensure search function is properly defined
  const searchHotels = async () => {
    setLoading(true);
    setError("");
    setHotels([]);
  
    const cityCode = cityMappings[city.trim()] || ""; // ✅ Ensure correct `cityCode`
  
    if (!cityCode) {
      setError("Please select a valid city from the suggestions.");
      setLoading(false);
      return;
    }
  
    try {
        console.log("Searching for cityCode:", cityCode);
        
        const response = await fetch(`http://localhost:5000/api/hotels/search?cityCode=${cityCode}`);
        console.log("Response Status:", response.status);
      
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
      
        const data = await response.json();
        console.log("✅ API Response Data:", JSON.stringify(data, null, 2)); 
      
  
      if (!data || data.length === 0) {
        setError("No hotels found. Try another search.");
        setHotels([]);
      } else {
        setHotels(data.slice(0, 10)); // ✅ Limit to first 10 results
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
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

        {/* ✅ Ensure search function is actually called on click */}
        <button onClick={searchHotels} disabled={loading} aria-label="Search Hotels" title="Click to search for hotels">
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <ul className="hotel-list">
        {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
            <li key={index} className="hotel-item">
                <h3>{hotel.name || "No Name Available"}</h3> 
                <p>{hotel.address?.countryCode || "No Address Available"}</p>
                <p>
                Coordinates: {hotel.geoCode?.latitude ?? "N/A"}, {hotel.geoCode?.longitude ?? "N/A"}
                </p>
            </li>
            ))
        ) : (
            !loading && (
            <li className="no-results">
                <p>No results found.</p>
            </li>
            )
        )}
      </ul>
    </div>
  );
};

export default HotelSearch;
