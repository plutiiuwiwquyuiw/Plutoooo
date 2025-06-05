const axios = require("axios");

const updateIntervals = {
    weather: 120000, // 2 minutes
    gear: 300000,    // 5 minutes
    seeds: 300000,   // 5 minutes
    egg: 1800000,    // 30 minutes
    honey: 3600000,  // 1 hour
    cosmetics: 14400000 // 4 hours
};

let lastUpdated = {
    weather: null,
    gear: null,
    seeds: null,
    egg: null,
    honey: null,
    cosmetics: null
};

async function fetchWeather(api) {
    try {
        const response = await axios.get(`${api}/api/weather`);
        const weatherData = response.data;
        // Process and display weather data
        console.log(`Weather Update: ${weatherData.icon} ${weatherData.description}`);
        lastUpdated.weather = weatherData.last_updated;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

async function fetchStock(api, type) {
    try {
        const response = await axios.get(`${api}/api/stock/${type}`);
        const stockData = response.data;
        // Process and display stock data
        console.log(`${stockData[type + '_stock'].name} Update:`, stockData[type + '_stock'].items);
        lastUpdated[type] = stockData[type + '_stock'].last_updated;
    } catch (error) {
        console.error(`Error fetching ${type} stock data:`, error);
    }
}

async function autoUpdater(api) {
    // Fetch weather data immediately
    await fetchWeather(api);

    // Set intervals for fetching stock data
    setInterval(() => fetchWeather(api), updateIntervals.weather);
    setInterval(() => fetchStock(api, 'gear'), updateIntervals.gear);
    setInterval(() => fetchStock(api, 'seeds'), updateIntervals.seeds);
    setInterval(() => fetchStock(api, 'egg'), updateIntervals.egg);
    setInterval(() => fetchStock(api, 'honey'), updateIntervals.honey);
    setInterval(() => fetchStock(api, 'cosmetics'), updateIntervals.cosmetics);
}

// Example usage
const apiUrl = "https://growagardenstock.vercel.app"; // Replace with your actual API URL
autoUpdater(apiUrl);
