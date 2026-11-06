import { Router } from "express";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Only JPG, PNG, WEBP, PDF, and TXT files are allowed."), allowed.includes(file.mimetype));
  }
});

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Choose a file first." });
  // This starter validates and receives the file in memory. It does not permanently store it.
  res.json({
    uploaded: true,
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    note: "Temporary upload received. Add private cloud storage before production."
  });
});

export default router;
