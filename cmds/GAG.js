const axios = require("axios");

module.exports = {
    name: "garden",
    usePrefix: false,
    usage: "garden",
    version: "1.1",
    admin: false,
    cooldown: 5,

    execute: async ({ api, event }) => {
        const { threadID } = event;
        const baseUrl = "https://growagardenstock.vercel.app/api";

        try {
            // Send loading message
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
            weatherText += `Weather: ${weather.currentWeather} (${weather.weatherType})\n`;
            weatherText += `Effect: ${weather.effectDescription}\n`;
            weatherText += `Bonus: ${weather.cropBonuses}\n`;
            weatherText += `Mutations: ${weather.mutations.length > 0 ? weather.mutations.join(", ") : "None"}\n`;

            // Format stock section
            let stockText = `\n🛒 STOCK\n━━━━━━━━━━━━━━\n`;
            for (const categoryKey in stock) {
                const category = stock[categoryKey];
                stockText += `\n📦 ${category.name}\n`;
                const items = category.items || [];
                if (items.length === 0) {
                    stockText += "No items in stock.\n";
                } else {
                    for (const item of items) {
                        stockText += `• ${item.name} - ${item.price || "N/A"} coins\n`;
                    }
                }

                // Optionally show countdown if exists
                if (category.countdown && category.countdown.ends_at) {
                    const endsAt = new Date(category.countdown.ends_at);
                    stockText += `⏱️ Refreshes at: ${endsAt.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}\n`;
                }
            }

            // Send final formatted message replacing loading message
            return api.sendMessage(`${weatherText}\n${stockText}`, threadID, loadingMsg.messageID);

        } catch (error) {
            console.error("❌ Garden command error:", error);
            return api.sendMessage("❌ Failed to fetch garden data. Please try again later.", threadID);
        }
    }
};
