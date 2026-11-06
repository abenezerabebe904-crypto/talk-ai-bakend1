import { Router } from "express";
const router = Router();

// Temporary memory only: history resets when this server restarts.
// Add a database and user authentication before launching persistent user accounts.
const conversations = new Map();

router.get("/:id", (req, res) => {
  res.json({ id: req.params.id, messages: conversations.get(req.params.id) || [] });
});

router.post("/:id", (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "messages must be an array." });
  if (messages.length > 100) return res.status(400).json({ error: "Too many messages." });
  const safe = messages.filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
    .slice(-100).map(m => ({ role: m.role, content: m.content.slice(0, 12000) }));
  conversations.set(req.params.id, safe);
  res.json({ saved: true, count: safe.length, note: "Temporary storage; connect a database for permanent history." });
});

router.delete("/:id", (req, res) => {
  conversations.delete(req.params.id);
  res.json({ deleted: true });
});

export default router;
