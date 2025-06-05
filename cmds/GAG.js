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

let updaterIntervals = {};

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
    updaterIntervals.weather = setInterval(() => fetchWeather(api), updateIntervals.weather);
    updaterIntervals.gear = setInterval(() => fetchStock(api, 'gear'), updateIntervals.gear);
    updaterIntervals.seeds = setInterval(() => fetchStock(api, 'seeds'), updateIntervals.seeds);
    updaterIntervals.egg = setInterval(() => fetchStock(api, 'egg'), updateIntervals.egg);
    updaterIntervals.honey = setInterval(() => fetchStock(api, 'honey'), updateIntervals.honey);
    updaterIntervals.cosmetics = setInterval(() => fetchStock(api, 'cosmetics'), updateIntervals.cosmetics);
}

function stopUpdater() {
    for (const interval in updaterIntervals) {
        clearInterval(updaterIntervals[interval]);
    }
    updaterIntervals = {};
}

module.exports = {
    name: "autoUpdater",
    usePrefix: true,
    usage: "!startUpdater | !stopUpdater | !refreshData",
    version: "1.0",
    admin: false,
    cooldown: 2,

    execute: async ({ api, event, args }) => {
        const { threadID } = event;
        const command = args[0];

        if (command === "startUpdater") {
            autoUpdater("https://your-api-url.com"); // Replace with your actual API URL
            return api.sendMessage("🔄 Auto-updater has been started!", threadID);
        } else if (command === "stopUpdater") {
            stopUpdater();
            return api.sendMessage("⏹️ Auto-updater has been stopped!", threadID);
        } else if (command === "refreshData") {
            await fetchWeather("https://your-api-url.com"); // Replace with your actual API URL
            await fetchStock("https://your-api-url.com", 'gear');
            await fetchStock("https://your-api-url.com", 'seeds');
            // Add other stock types as needed
            return api.sendMessage("🔄 Data has been manually refreshed!", threadID);
        } else {
            return api.sendMessage("⚠️ Invalid command. Use !startUpdater, !stopUpdater, or !refreshData.", threadID);
        }
    }
};
