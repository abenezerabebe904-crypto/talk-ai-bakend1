import { Router } from "express";
import OpenAI from "openai";

const router = Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res, next) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY is not configured on the server." });
    const { prompt } = req.body || {};
    if (typeof prompt !== "string" || !prompt.trim()) return res.status(400).json({ error: "Describe the image you want." });
    if (prompt.length > 2000) return res.status(400).json({ error: "Image description is too long." });

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt.trim(),
      size: "1024x1024"
    });
    res.json({ image: result.data?.[0]?.b64_json || null });
  } catch (err) {
    next(err);
  }
});

export default router;
