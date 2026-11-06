# TALK AI Backend

A starter Node.js API for TALK AI.

## Deploy on Render
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Add `OPENAI_API_KEY` in Render's Environment settings.
- Optional: set `OPENAI_MODEL` and `ALLOWED_ORIGINS`.

## Routes
- `GET /` and `GET /health`
- `POST /api/chat` with `{ "message": "Hello", "history": [], "mode": "chat" }`
- `GET /api/history/:id`
- `POST /api/history/:id` with `{ "messages": [] }`
- `DELETE /api/history/:id`
- `POST /api/uploads` as multipart form field `file`
- `POST /api/images` with `{ "prompt": "A friendly robot mascot" }`

## Important limitations
This is a starter backend, not the complete TALK AI product. Conversation history is temporary and resets when the server restarts. Uploads are received in memory and are not permanently stored. Authentication, database persistence, secure cloud file storage, web search, social sign-in, payment, and safe update automation still need to be built and tested before public launch.

Never commit `.env` or expose your OpenAI API key in browser JavaScript or GitHub.
