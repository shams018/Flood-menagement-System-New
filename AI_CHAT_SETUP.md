# AI Chat Setup Guide

The chat system is now fully integrated with OpenAI's ChatGPT API for intelligent, context-aware responses.

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again)

### 2. Add to Backend Environment

Create a `.env` file in the `backend/` directory (if it doesn't exist) and add:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

Replace `sk-your-actual-key-here` with your actual OpenAI API key.

### 3. Install Dependencies

```bash
cd backend
npm install
```

This installs the OpenAI package added to package.json.

### 4. Start the Backend

```bash
npm run dev
```

## How It Works

- **General Channel**: Regular operator-to-operator messaging (no AI)
- **Support Channel**:
  - Users send messages to ask for help
  - The Sentinel AI Assistant automatically responds with intelligent, context-aware replies
  - AI responses are styled with a cyan/blue gradient and marked with an AI icon
  - Messages include flood safety info, shelter locations, and emergency guidance
  - Human HQ team can also respond in the same channel

## Features

✅ Real-time chat with socket.io
✅ AI Assistant responds automatically in Support channel
✅ Context-aware responses (reads recent conversation history)
✅ Fallback mode if OpenAI API is unavailable
✅ Professional styling for AI vs. human messages
✅ Full conversation history stored in MongoDB

## Fallback Mode

If OpenAI API key is not set, the system automatically uses fallback responses. Fallback mode provides helpful guidance but without the full AI intelligence. To enable full AI capabilities, add your OpenAI API key.

## Cost Considerations

OpenAI API calls are metered. Each chat message costs a small amount (typically $0.001-0.002 per message with GPT-3.5-turbo). You can:

- Set API usage limits in your OpenAI account
- Monitor usage at https://platform.openai.com/account/billing/overview
- Adjust the `max_tokens` parameter in `backend/src/services/aiChatService.js` to control response length

## Troubleshooting

**AI responses not appearing?**

- Check that OPENAI_API_KEY is set in `.env`
- Check backend logs for errors
- Verify you're in the "Support" channel
- Check your OpenAI account has available credits

**Getting 401 errors?**

- Your API key may be invalid or revoked
- Generate a new key at https://platform.openai.com/api-keys

**Rate limiting?**

- OpenAI has rate limits on free accounts
- Upgrade your account or wait for the rate limit to reset
