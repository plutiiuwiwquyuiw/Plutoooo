const axios = require("axios");

module.exports = {
    name: "garden",
    usePrefix: false,
    usage: "garden",
    version: "1.2",
    admin: false,
    cooldown: 5,

    execute: async ({ api, event }) => {
        const { threadID } = event;
        const baseUrl = "https://growagardenstock.vercel.app/api";

        try {
            const loadingMsg = await api.sendMessage("🌱 Gathering the latest garden update...", threadID);

            await axios.get(`${baseUrl}/refresh`);
            const weatherRes = await axios.get(`${baseUrl}/weather`);
            const stockRes = await axios.get(`${baseUrl}/stock/all`);

            const weather = weatherRes.data;
            const stock = stockRes.data;

            let weatherText = `🌤️  WEATHER REPORT\n━━━━━━━━━━━━━━━━━━\n`;
            weatherText += `📌 Weather: ${weather.currentWeather} (${weather.weatherType})\n`;
            weatherText += `🌟 Effect: ${weather.effectDescription}\n`;
            weatherText += `🎁 Bonus: ${weather.cropBonuses}\n`;
            weatherText += `🧬 Mutations: ${weather.mutations.length > 0 ? weather.mutations.join(", ") : "None"}\n`;

            let stockText = `\n🛒  STOCK OVERVIEW\n━━━━━━━━━━━━━━━━━━\n`;

            for (const categoryKey in stock) {
                const category = stock[categoryKey];
                stockText += `\n📦 ${category.name}\n`;

                const items = category.items || [];
                if (items.length === 0) {
                    stockText += `No items in stock.\n`;
                } else {
                    for (const item of items) {
                        const quantity = item.quantity ?? "N/A";
                        stockText += `• ${item.name} - ${quantity} pcs\n`;
                    }
                }

                if (category.countdown?.formatted) {
                    stockText += `⏱️ Refresh in: ${category.countdown.formatted}\n`;
                }

                if (category.countdown?.ends_at) {
                    const endsAt = new Date(category.countdown.ends_at);
                    stockText += `⏱️ Refreshes at: ${endsAt.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}\n`;
                }
            }

            const finalMessage = `${weatherText}\n${stockText}`;
            return api.sendMessage(finalMessage, threadID, loadingMsg.messageID);

        } catch (error) {
            console.error("❌ Garden command error:", error);
            return api.sendMessage("❌ Failed to fetch garden data. Please try again later.", threadID);
        }
    }
};
