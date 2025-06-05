const axios = require("axios");

module.exports = {
    name: "garden",
    usePrefix: false,
    usage: "garden",
    version: "1.0",
    admin: false,
    cooldown: 5,

    execute: async ({ api, event }) => {
        const { threadID } = event;
        const baseUrl = "https://growagardenstock.vercel.app/api";

        try {
            // Send initial loading message
            const loadingMsg = await api.sendMessage("🌱 Fetching updated garden data...", threadID);

            // Step 1: Refresh data
            await axios.get(`${baseUrl}/refresh`);

            // Step 2: Get updated weather
            const weatherRes = await axios.get(`${baseUrl}/weather`);
            const weather = weatherRes.data;

            // Step 3: Get all stock data
            const stockRes = await axios.get(`${baseUrl}/stock/all`);
            const stock = stockRes.data;

            // Format weather section
            let weatherText = `🌤️ WEATHER\n━━━━━━━━━━━━━━\n`;
            weatherText += `Effect: ${weather.effect}\n`;
            weatherText += `Bonus: ${weather.bonus}\n`;
            weatherText += `Mutation: ${weather.mutation}\n`;

            // Format stock section
            let stockText = `\n🛒 STOCK\n━━━━━━━━━━━━━━\n`;
            for (const category in stock) {
                stockText += `\n📦 ${category.toUpperCase()}\n`;
                const items = stock[category];
                if (items.length === 0) {
                    stockText += "No items in stock.\n";
                } else {
                    for (const item of items) {
                        stockText += `• ${item.name} - ${item.price} coins (⏱️ ${item.countdown})\n`;
                    }
                }
            }

            // Send final message
            return api.sendMessage(`${weatherText}\n${stockText}`, threadID, loadingMsg.messageID);

        } catch (error) {
            console.error("❌ Garden command error:", error);
            return api.sendMessage("❌ Failed to fetch garden data. Please try again later.", threadID);
        }
    }
};
