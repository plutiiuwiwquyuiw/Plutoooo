import axios from 'axios';

const config = {
    name: "gemini",
    aliases: ["gemini"],
    description: "Interact with the Gemini AI model.",
    usage: "[query]",
    cooldown: 5,
    permissions: [1, 2],
    credits: "Coffee",
};

async function onCall({ message, args }) {
    const userQuery = args.join(" ");

    if (!userQuery) return message.reply("Please provide a query.");

    await message.react("🕰️"); // Processing indicator

    const apiUrl = 'https://free-ai-models.vercel.app/v1/chat/completions';

    const requestBody = {
        model: 'gemini-1.5-pro-latest',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userQuery }
        ]
    };

    try {
        const response = await axios.post(apiUrl, requestBody);

        if (!response.data || !response.data.choices?.length)
            throw new Error("No data returned from the AI");

        const replyText = response.data.choices[0].message.content;

        await message.reply(replyText);
        await message.react("✅");
    } catch (error) {
        console.error("AI Error:", error.response?.data || error.message);
        await message.react("❎");
        await message.reply("An error occurred while communicating with Gemini.");
    }
}

export default {
    config,
    onCall,
};
