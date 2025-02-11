# Travel Buddy - Full Stack Application

## 🚀 Project Overview
Travel Buddy is an interactive full-stack application designed to help travelers plan, organize, and manage their trips seamlessly. Users can create itineraries, track expenses, check real-time flight and hotel availability, and access weather updates.

---

## ✈️ Key Features

- **🔍 Flight Search (Powered by Amadeus API)**
  - Enter a **city or airport name** and get results for available flights.
  - Automatic **city-to-airport conversion** (e.g., "Orlando" → "MCO").
  - View **real-time pricing, airlines, and schedules**.

- **🏨 Hotel Search (Powered by Amadeus API)**
  - Search for **hotels in any city** with up-to-date availability.
  - View hotel names, ratings, and locations.
  - Supports **future enhancements** like price comparisons.

- **🌦️ Weather Forecast**
  - Get **real-time weather updates** for your trip.
  - Displays **temperature, conditions, and forecast**.

- **💰 Expense Tracking**
  - Add travel expenses manually.
  - View **total cost breakdown** for your itinerary.

- **📍 Itinerary Management**
  - Create and customize **day-by-day itineraries**.
  - Organize **flights, hotels, and activities** in one place.

- **🔐 User Authentication**
  - Secure **JWT-based authentication** for login & signup.
  - User-specific **profile and travel data**. 

---

## 📌 Project Setup

### **1️⃣ Clone the Repository**
```sh
git clone <repository_url>
cd travel-buddy
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Setup Environment Variables**
To use the required APIs, each team member must create a `.env` file with their own API keys. Follow these steps:

1. **Copy the `.env.example` file**
   ```sh
   cp .env.example .env
   ```
2. **Open the `.env` file and add your API keys**
   ```plaintext
   AMADEUS_API_KEY=your_amadeus_key_here
   AMADEUS_API_SECRET=your_amadeus_secret_here
   WEATHER_API_KEY=your_weather_api_key_here
   CURRENCY_API_KEY=your_currency_api_key_here
   AUTH_API_KEY=your_auth_api_key_here
   ITINERARY_API_KEY=your_itinerary_api_key_here
   ```
3. **Save the file.**

🔹 **Important:** `.env` is included in `.gitignore` and **should never be committed** to GitHub.

### **4️⃣ Start the Development Server**
```sh
npm run dev
```

### **5️⃣ Update `.gitignore`**
Ensure `.gitignore` includes the `.env` file:
```plaintext
# Environment Variables
.env
.env.local
.env.*.local
```
If not, add these lines **manually** to prevent accidental commits of API keys.

---

## 📡 API Endpoints & Usage

### 🔹 Flight Search
**Get** `/api/flights/search?origin=JFK&destination=LAX&date=2025-03-15`
#### 🔹 **Returns**: A list of available flights.
```json
[
  {
    "flightNumber": "AA123",
    "airline": "American Airlines",
    "price": "250",
    "departureTime": "2025-03-15T10:00:00",
    "arrivalTime": "2025-03-15T14:00:00"
  }
]
```
### 🔹 Hotel Search
**GET** `/api/hotels/search?cityCode=NYC`
#### 🔹 **Returns**: Available hotels in the selected city.
```json
[
  {
    "hotelName": "The Plaza Hotel",
    "price": "350",
    "rating": "5-star",
    "location": "Central Park, NYC"
  }
]
```
---

## 🚀 Deployment Guide

### **1️⃣ Backend Deployment (Express + PostgreSQL)**
- **Ensure your `.env` file is set up.**
- Deploy the backend on **Render** as a **Web Service**.
- Ensure the database **(PostgreSQL) is set up and connected**.

### **2️⃣ Frontend Deployment (React + Vite)**
- **Run the following command to build the frontend:**
  ```sh
  npm run build
- Push your changes  Github
- Deploy on **Render** as a **Static Site**

### **3️⃣ Backend Deployment Steps**
- Backend runs on **Express + PostgreSQL**.
- Frontend is built with **React (Vite framework)**.
- `.env` **must be manually configured in Render for API keys.**

---

## 📡 API Integrations
Travel Buddy integrates multiple APIs to provide real-time data and seamless trip planning.

### **1️⃣ Amadeus API**
- **Flights:** Fetches real-time flight prices, schedules, and airline details.
- **Hotels:** Searches for available hotels based on city names.
- **City-to-Airport Mapping:** Converts city names (e.g., "Orlando") to airport codes (`MCO`).

### **2️⃣ Weather API**
- **Provides live weather forecasts** for any city.
- Displays **temperature, wind speed, and conditions**.

### **3️⃣ Currency Exchange API**
- Converts travel expenses into **different currencies**.
- Helps users **budget effectively** while traveling.

### **4️⃣ Authentication API**
- Secure **JWT-based user authentication**.
- Supports **user sessions, login, and signup**.

### **5️⃣ Itinerary Management API**
- Allows users to **store and manage travel plans**.
- Supports **adding flights, hotels, and activities**.

Each API requires its respective key, which should be stored securely in the `.env` file.

---

## 🛠 Technologies Used
### **Frontend:** 
- **React** (TypeScript, Vite)
- **React Router** (Navigation)
- **TailwindCSS** (Styling)
- **Axios** (API Calls)
### **Backend:** 
- **Node.js, Express.js** (Server)
- **TypeScript** (For static type safety)
- **Amadeus API** (Flights & Hotels)
- **PostgreSQL** (Sequelize ORM)
- **JWT Authentication** (Secure login system)
### **Other Tools:** 
- **Render** (Deployment)
- **ESLint & Prettier** (Code formatting & linting)

---

## 🎯 Future Enhancements
- **Additional itinerary customization features**
- **Enhanced user profile management**
- **Improved AI-based travel recommendations** (Based on user preferences)
- **Mobile responsiveness improvements** (React Native version of Travel Buddy)
- **Offline Mode** (Allow users to save itineraries offline)
- **Multiple Currency Support** (Dynamically adjust pricing)

---

## 📜 License
This project is licensed under the MIT License. Feel free to contribute and improve Travel Buddy!

