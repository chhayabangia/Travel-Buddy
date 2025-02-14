import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import "../css/hotels.css";
import "../css/forms.css";


// Predefined city mappings
const cityMappings: { [key: string]: string } = {
  "new york": "NYC",
  "los angeles": "LAX",
  "chicago": "ORD",
  "miami": "MIA",
  "houston": "IAH",
  "san francisco": "SFO",
  "las vegas": "LAS",
  "orlando": "MCO",
  "boston": "BOS",
  "seattle": "SEA",
};

const cityOptions = Object.keys(cityMappings);

const HotelSearch = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  // Handle city input with auto-suggestions
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    setCity(input);

    const lowerCaseInput = input.trim().toLowerCase();
    console.log("🔎 User Input:", input);
    console.log("🔎 Lowercase Input:", lowerCaseInput);

    if (lowerCaseInput === "") {
      setFilteredCities([]); // ✅ Hide dropdown when input is cleared
      } else if (cityMappings.hasOwnProperty(lowerCaseInput)) {
          setCity(cityMappings[lowerCaseInput]);
          setFilteredCities([]); // ✅ Hide suggestions when a valid city is selected
      } else {
          setFilteredCities(
              cityOptions.filter((c) => c.toLowerCase().startsWith(lowerCaseInput))
          );
      }
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(cityMappings[selectedCity.toLowerCase()] || selectedCity);
    setFilteredCities([]);
  };

  // ✅ Ensure search function is properly defined
  const searchHotels = async () => {
    setLoading(true);
    setError(""); 
    setHotels([]);

    // Ensure city name is mapped correctly to a city code
    let lowerCaseCity = city.trim().toLowerCase();
    let cityCode = cityMappings[lowerCaseCity] || "";
    
    if (!cityCode && city.trim().length > 2) {
      // If no mapping is found but input is long enough, use uppercase city name as fallback
      cityCode = city.trim().toUpperCase();
    }
    
    if (!cityCode) {
      console.warn(`❌ No city code found for "${city}". Showing error message...`);
      setError("Please select a valid city from the dropdown.");
      setLoading(false);
      return;
    }
    
    console.log(`✅ Final City Code for API Request: ${cityCode}`);    
    const BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000";
  
    const apiUrl = `${BASE_URL}/api/hotels/search?cityCode=${cityCode}`;
    
    console.log(`🚀 Sending Hotel API Request: ${apiUrl}`);
    
    try {
      const response = await fetch(apiUrl);
    
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Hotel API Response:", data);

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
        <label htmlFor="destination" className="visually-hidden">Destination</label>
          <input
              id="destination"
              type="text"
              placeholder="Enter city"
              title="Enter city for hotels"
              value={city}
              onChange={handleCityChange}
          />
          {filteredCities.length > 0 && city.length > 1 && (
              <ul className="autocomplete-list">
                  {filteredCities.map((c, index) => (
                      <li key={index} onClick={() => handleCitySelect(c)}>
                          {c}
                      </li>
                  ))}
              </ul>
            )}
        </div>

        <div className="input-group">
          <label htmlFor="check-in" className="visually-hidden">Check-in</label>
          <input type="date" id="check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>

        <div className="input-group">
          <label htmlFor="check-out" className="visually-hidden">Check-out</label>
          <input type="date" id="check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </div>

        <div className="input-group">
          <FaUsers className="input-icon" />
          <label htmlFor="guests" className="visually-hidden">Guests</label>
          <select
            id="guests"
            title="Select number of guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        <button onClick={searchHotels} disabled={loading} aria-label="Search Hotels" title="Click to search for hotels">
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {!loading && hotels.length === 0 && !error && (
        <p className="no-results">No results found. Try another search.</p>
      )}

      {hotels.length > 0 ? (
        <ul className="hotel-list">
          {hotels.map((hotel, index) => {
            const { name, address, geoCode, lastUpdate, price } = hotel;

            return (
              <li key={index} className="hotel-item">
                <h3>{name || "No Name Available"}</h3>
                
                {/* 🌍 Display Full Address or Geo Coordinates */}
                <p>
                  <strong>Location:</strong> 
                  {address?.countryCode 
                    ? `${address?.countryCode}${address?.cityName ? `, ${address.cityName}` : ""}`
                    : `Lat: ${geoCode?.latitude}, Lng: ${geoCode?.longitude}`
                  }
                </p>

                {/* 💰 Display Price if Available */}
                {price ? (
                  <p><strong>Price:</strong> ${price}</p>
                ) : (
                  <p><strong>Price:</strong> Not Available</p>
                )}

                {/* 🕒 Improve Last Update Formatting */}
                {lastUpdate && (
                  <p><strong>Updated:</strong> {new Date(lastUpdate).toLocaleDateString()} at {new Date(lastUpdate).toLocaleTimeString()}</p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No hotels found for this search.</p>
      )}
    </div>
  );
};

export default HotelSearch;
