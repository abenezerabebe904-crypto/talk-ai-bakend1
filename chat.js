import { Router } from "express";
import OpenAI from "openai";

const router = Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res, next) => {
  try {
    const { message, history = [], mode = "chat" } = req.body || {};
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY is not configured on the server." });
    if (typeof message !== "string" || !message.trim()) return res.status(400).json({ error: "Please send a message." });
    if (message.length > 12000) return res.status(400).json({ error: "Message is too long." });

    const instructions = {
      chat: "You are TALK AI, a helpful, accurate, friendly assistant. Explain clearly and adapt to the user's level.",
      homework: "You are TALK AI Study Helper. Teach concepts and show steps. Help the learner understand rather than simply encouraging academic dishonesty.",
      coding: "You are TALK AI Coding Helper. Explain code clearly, point out security issues, and provide runnable examples when appropriate."
    };
    const input = [];
    for (const item of Array.isArray(history) ? history.slice(-12) : []) {
      if (item && ["user", "assistant"].includes(item.role) && typeof item.content === "string") {
        input.push({ role: item.role, content: item.content.slice(0, 6000) });
      }
    }
    input.push({ role: "user", content: message.trim() });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: instructions[mode] || instructions.chat,
      input
    });
    res.json({ reply: response.output_text || "I could not generate a reply. Please try again." });
  } catch (err) {
    next(err);
  }
});

export default router;
