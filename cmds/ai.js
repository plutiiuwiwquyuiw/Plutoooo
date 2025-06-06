const axios = require("axios");

module.exports = {
    name: "ai",
    usePrefix: false,
    usage: "ai <your question>",
    version: "1.2",
    admin: false,
    cooldown: 2,

    execute: async ({ api, event, args }) => {
        try {
            const { threadID } = event;
            const question = args.join(" ");

            if (!question) {
                return api.sendMessage("❓ Please enter a question.\nUsage: ai <your question>", threadID);
            }

            const loadingMsg = await api.sendMessage("🤖 GROK-2 is thinking...", threadID);

            const apiUrl = `https://ajiro.gleeze.com/api/ai?model=grok-2&system=You are a LLM called groq invented by elon musk&question=${encodeURIComponent(question)}`;

            const response = await axios.get(apiUrl);
            const result = response?.data?.response;

            if (response?.data?.success && result) {
                const reply = `🧠 GROK-2 AI\n━━━━━━━━━━━━━━━━\n📥 Question: ${question}\n\n💬 Answer:\n${result}\n━━━━━━━━━━━━━━━━`;
                return api.sendMessage(reply, threadID, loadingMsg.messageID);
            }

            return api.sendMessage("⚠️ GROK-2 couldn't process your request. Try again later.", threadID, loadingMsg.messageID);
        } catch (error) {
            console.error("❌ GROK-2 Error:", error);
            return api.sendMessage("❌ An error occurred while contacting GROK-2 API.", event.threadID);
        }
    }
};
