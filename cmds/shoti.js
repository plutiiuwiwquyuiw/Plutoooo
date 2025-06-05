const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
    module.exports = {
    name: "weather",
    usePrefix: false,
    usage: "weather",
    version: "1.0",
    cooldown: 5,
    admin: false,

    execute: async ({ api, event }) => {
        const BASE_URL = "https://growagardenstock.vercel.app";

        try {
            // Fetch current weather data
            const weatherResponse = await fetch(`${BASE_URL}/api/weather`);
            const weather = await weatherResponse.json();

            // Construct the response message
            const message = `
                🌤️ Current Weather: ${weather.currentWeather}
                ${weather.icon} ${weather.effectDescription}
                Crop Bonuses: ${weather.cropBonuses}
                Rarity: ${weather.rarity}
                Last Updated: ${new Date(weather.last_updated).toLocaleString()}
            `;

            // Send the weather information
            api.sendMessage(message, event.threadID, event.messageID);
        } catch (error) {
            console.error("❌ Error fetching weather data:", error);
            api.sendMessage("❌ Failed to retrieve weather data.", event.threadID, event.messageID);
        }
    },
};
