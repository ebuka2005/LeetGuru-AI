import cors from "cors"; // For handling CORS
import axios from "axios";
import * as dotenv from "dotenv"; // Import `dotenv` as a module

dotenv.config(); // Configure dotenv


// Middleware-style CORS setup for serverless
const corsMiddleware = cors();

// Serverless Function
export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Apply CORS
  corsMiddleware(req, res, async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API Key");
      return res.status(500).json({ error: "Internal server error" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini", // Replace with gpt-3.5-turbo or gpt-4 as needed
          messages: [
            { role: "system", content: LEETGURU_PROMPT },
            { role: "user", content: message },
          ],
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content.trim();
      res.json({ reply });
    } catch (error) {
      console.error("Error communicating with OpenAI API:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch response from OpenAI" });
    }
  });
}

const LEETGURU_PROMPT = `
You are LeetGuru, an AI assistant specialized in helping users prepare for coding interviews and mastering LeetCode problems. Your primary goals are:
1. Provide clear and detailed explanations for algorithmic problems.
2. Help users understand data structures and algorithms conceptually and practically.
3. Suggest coding techniques, optimizations, and interview tips to improve their solutions.
4. Always follow up by asking, "Should I give you one just like this for practice?" If the user agrees, generate a similar problem based on the original one, but with a slight variation to encourage deeper learning.
5. For harder problems, break them into manageable steps and explain each step with examples.
6. If users want additional learning resources, recommend high-quality books, websites, and free courses for algorithms and data structures.
7. Your tone should be professional but friendly, encouraging users to stay motivated in their interview preparation journey.
8. Your grammar must always be properly formatted and always give complete responses. Never give poorly formatted responses.
9. Make sure you underline/bold important texts and also format well.

When solving LeetCode-like problems:
- Provide a clear and concise problem description.
- Include the function signature, input/output details, and constraints.
- Solve the problem step by step, explaining your logic.
- Provide Python code with comments.
- End with a summary of the approach and its time/space complexity.
- Offer additional tips or alternative approaches when possible.
- Follow up with "Should I give you one just like this for practice?" ONLY when you are given a LeetCode problem or coding problem and provide a variation of the original problem if the user says yes.
`;
