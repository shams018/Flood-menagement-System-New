import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let openaiClient = null;

if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are an AI assistant for a flood management and disaster response system called "Sentinel Protocol".
Your role is to:
1. Provide accurate flood safety, preparedness, and emergency response guidance.
2. Help users understand flood risks, warnings, evacuation, shelters, and rescue resources.
3. Answer clearly, concisely, and with practical next steps.
4. If you do not know a specific location or cannot confirm exact details, be honest and advise the user to contact local emergency services.
5. Avoid making up exact addresses, times, or data that you cannot verify.
6. Use a professional, calm, and supportive tone.

You have access to real-time flood monitoring data and can help coordinate emergency response efforts.
Prioritize user safety and local official guidance.`;

export async function getAIResponse(userMessage, conversationHistory = []) {
  if (!openaiClient) {
    return {
      success: false,
      error:
        "AI service not configured. Please set OPENAI_API_KEY environment variable.",
      isConfigError: true,
    };
  }

  try {
    // Build conversation messages
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.is_ai_message ? "assistant" : "user",
        content: msg.body,
      })),
      { role: "user", content: userMessage },
    ];

    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.25,
    });

    const aiMessage =
      response.choices[0]?.message?.content || "Unable to generate response";

    return {
      success: true,
      message: aiMessage,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      success: false,
      error: error.message || "Failed to get AI response",
    };
  }
}

export async function getSimpleFallbackResponse(userMessage) {
  // Fallback responses for when OpenAI is not available
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("greet")
  ) {
    return "Hello! I'm the Sentinel AI Assistant. How can I help you with flood safety or emergency response today?";
  }

  if (lowerMessage.includes("flood") || lowerMessage.includes("alert")) {
    return "I can help you understand flood risks and warnings in your area. Please tell me your location or ask specific questions about flood safety.";
  }

  if (
    lowerMessage.includes("shelter") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("emergency")
  ) {
    return "For emergency assistance, please use the SOS button or contact your local emergency services immediately. I can help provide information about nearby shelters and resources.";
  }

  if (lowerMessage.includes("what") || lowerMessage.includes("how")) {
    return "I'm here to help! Ask me about flood preparedness, emergency response, shelter locations, or any safety concerns you have.";
  }

  return "I understand your message. I'm currently offline for AI responses but can still connect you with support. Please contact our support team for immediate assistance.";
}

export function isAIServiceAvailable() {
  return Boolean(openaiClient);
}
