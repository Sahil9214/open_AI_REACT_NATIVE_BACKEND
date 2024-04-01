const OpenAI = require("openai");
require("dotenv").config();
const express = require("express");
const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Corrected property name
});

// Middleware to parse request body
app.use(express.json());

// Define the chat endpoint
app.post("/chat", async (req, res) => {
  try {
    // Extract message from the request body
    const { message } = req.body;

    // Call the function to interact with OpenAI Chat API
    const response = await callChatGpt([
      { role: "system", content: "you have to give me requires answer" },
      { role: "user", content: message }, // Use the extracted message
    ]);

    // Send the response back to the client
    return res.status(200).json({ message: response });
  } catch (err) {
    // Handle errors
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to interact with OpenAI Chat API
async function callChatGpt(messages) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    return completion.choices[0].message.content; // Extract content from the response
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error to be caught in the route handler
  }
}

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
