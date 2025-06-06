const axios = require('axios');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports = {
    name: 'pluto',
    description: 'Ask an AI question with GROK-2',

    async execute(api, event, args) {
        const question = args.join(' ');

        if (!question) {
            return api.sendMessage(
                `❓ Please enter a question.\n📌 Usage: ${config.prefix}ai <your question>`,
                event.threadID,
                event.messageID
            );
        }

        await api.sendMessage("🤖 Thinking... Fetching response from GROK-2.", event.threadID, event.messageID);

        try {
            const response = await axios.get(`https://ajiro.gleeze.com/api/ai`, {
                params: {
                    model: 'grok-2',
                    system: 'You are a LLM called groq invented by elon musk',
                    question: question
                }
            });

            if (response.data.success && response.data.response) {
                const formattedReply = 
`🧠  GROK-2 AI RESPONSE
━━━━━━━━━━━━━━━━━━━━━━
📥 Question:
"${question}"

💬 Answer:
${response.data.response}`;

                return api.sendMessage(formattedReply, event.threadID, event.messageID);
            } else {
                return api.sendMessage(
                    "⚠️ GROK-2 couldn't process your request. Please try again shortly.",
                    event.threadID,
                    event.messageID
                );
            }

        } catch (error) {
            console.error("❌ AI command error:", error.message || error);
            return api.sendMessage(
                "❌ Something went wrong while connecting to GROK-2. Please try again later.",
                event.threadID,
                event.messageID
            );
        }
    }
};
