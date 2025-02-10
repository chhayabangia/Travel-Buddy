import Amadeus from 'amadeus';
import { config } from 'dotenv';

config();

const { AMADEUS_API_KEY, AMADEUS_API_SECRET } = process.env;

console.log("✅ Checking if `amadeus.ts` is running...");
console.log("✅ Loaded API Key in Node.js:", AMADEUS_API_KEY ?? "❌ Not Loaded!");

const amadeus = new Amadeus({
  clientId: AMADEUS_API_KEY,
  clientSecret: AMADEUS_API_SECRET,
});

export default amadeus;
