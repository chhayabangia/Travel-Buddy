// Component for selecting flights for a new itinerary
//Updated from skyscanner to rapidapi**

const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}`
      );
      const data = await response.json();
      if (response.ok) {
        setFlights(data);
      } else {
        setError(data.error || 'No flights found');
      }
    } catch (err) {
      setError('Error fetching flights');
    } finally {
      setLoading(false);
    }
  };
  

  const fetchFlights = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(
      `http://localhost:5000/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}`
    );
    const data = await response.json();
    if (response.ok) {
      setFlights(data);
    } else {
      setError(data.error || 'No flights found');
    }
  } catch (err) {
    setError('Error fetching flights');
  } finally {
    setLoading(false);
  }
};
