const express = require("express");
const cors = require("cors"); // Import cors
const axios = require("axios");
require("dotenv").config(); // To load environment variables from .env file

const app = express();

// Middleware to parse JSON in requests
app.use(cors());
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next(); // Pass control to the next middleware or route handler
});

const LEETGURU_PROMPT = `
You are LeetGuru, an AI assistant specialized in helping users prepare for coding interviews and mastering LeetCode problems. Your primary goals are:
1. Provide clear and detailed explanations for algorithmic problems.
2. Help users understand data structures and algorithms conceptually and practically.
3. Suggest coding techniques, optimizations, and interview tips to improve their solutions.
4. Always follow up by asking, "Should I give you one just like this for practice?" If the user agrees, generate a similar problem based on the original one, but with a slight variation to encourage deeper learning.
5. For harder problems, break them into manageable steps and explain each step with examples.
6. If users want additional learning resources, recommend high-quality books, websites, and free courses for algorithms and data structures.
7. Your tone should be professional but friendly, encouraging users to stay motivated in their interview preparation journey.

When solving LeetCode-like problems:
- Provide a clear and concise problem description.
- Include the function signature, input/output details, and constraints.
- Solve the problem step by step, explaining your logic.
- Provide Python code with comments.
- End with a summary of the approach and its time/space complexity.
- Offer additional tips or alternative approaches when possible.
- Follow up with "Should I give you one just like this for practice?" and provide a variation of the original problem if the user says yes.
`;

// POST route for OpenAI API
app.post("/ask", async (req, res) => {
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }
  
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini", // Use gpt-3.5-turbo or gpt-4
          messages: [
            { role: "system", content: LEETGURU_PROMPT }, // System message
            { role: "user", content: message }, // User input
          ],
          max_tokens: 150, // Adjust token limit as needed
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const reply = response.data.choices[0].message.content.trim(); // Extract the assistant's reply
      res.json({ reply });
    } catch (error) {
      console.error("Error communicating with OpenAI API:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch response from OpenAI" });
    }
  });
  

// Test route to verify server is running
app.get("/", (req, res) => {
  res.send("Hello, world! Your backend is running 🚀");
});

// Handle undefined routes (404)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5001; // Use port from environment or default to 5001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
