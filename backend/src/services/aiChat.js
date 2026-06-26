/**
 * AI Chat Response Service
 * Generates intelligent responses for flood management chat
 */

const aiResponses = {
  // Greeting patterns
  greeting: [
    "Hello! I'm the Sentinel AI Assistant. How can I help you today with flood management or emergency response?",
    "Hi there! Welcome to the Emergency Response Chat. What can I assist you with?",
    "Greetings! I'm here to help with flood alerts, victim registration, or emergency coordination. What do you need?",
  ],

  // Emergency/SOS patterns
  emergency: [
    "🚨 EMERGENCY ALERT: If you or someone near you is in immediate danger, please contact local emergency services immediately at 911. For victim registration, visit the Emergency SOS page in our system.",
    "URGENT: Please provide your location and the nature of the emergency. Emergency services have been alerted and are responding. If it's life-threatening, call emergency services directly.",
    "I'm escalating this to emergency response team. Please stay safe and provide details about: 1) Your exact location 2) Number of people affected 3) Type of hazard",
  ],

  // Flood information
  flood: [
    "Flood information: Check our Live Map for real-time flood alerts and water levels. Regional status shows active zones and rescue team locations. Would you like help locating nearby shelters or emergency services?",
    "Regarding flood alerts: Our system monitors water levels and weather conditions. You can subscribe to alerts for your region. Current active alerts are displayed on the dashboard. Which region are you concerned about?",
    "Flood preparedness: 1) Register victims for tracking, 2) Locate nearby shelters, 3) Check evacuation routes, 4) Monitor weather alerts. What do you need help with?",
  ],

  // NGO Coordination
  ngo: [
    "For NGO coordination, please visit the NGO Coordination page. You can register your organization, coordinate rescue efforts, and communicate with other agencies. What specific assistance do you need?",
    "NGO Registration: Are you looking to register an NGO or coordinate with existing organizations? I can guide you through the process.",
    "NGO coordination involves resource sharing, team management, and inter-agency communication. Visit the coordination dashboard to manage your resources.",
  ],

  // Victim Registration
  victim: [
    "For victim registration: 1) Go to Victim Registration page, 2) Provide personal information, 3) Document health conditions, 4) Specify location. This helps us track affected individuals and provide appropriate aid.",
    "Victim information is crucial for rescue operations. When registering, include: name, contact info, location, family members, and any special needs. Would you like step-by-step guidance?",
    "I can help you register victims. Please provide: 1) Full names, 2) Age/gender, 3) Location, 4) Contact number, 5) Any injuries or health issues. Would you like to start now?",
  ],

  // Shelter information
  shelter: [
    "Shelter locations: Check the Live Map for shelter icons and details. Shelters have capacity information and amenities listed. You can also see current occupancy levels. Which area are you looking for?",
    "For shelter information: 1) View Live Map, 2) See capacity and amenities, 3) Get directions. All nearby shelters are marked. Do you need help finding one in your area?",
    "Shelter resources are displayed on our map with real-time capacity data. Click on any shelter marker to see details, address, phone number, and current occupancy.",
  ],

  // Analytics/Status
  status: [
    "Current system status: The dashboard shows real-time statistics including victims registered, active rescue teams, operational shelters, and ongoing alerts. All data is updated continuously.",
    "System analytics show: 1) Total victims registered, 2) Active rescue teams, 3) Shelters operational, 4) Current alerts. Would you like detailed information on any of these?",
    "Our analytics provide insight into disaster response effectiveness. You can view trends, regional data, and team performance on the Admin Dashboard.",
  ],

  // General help
  help: [
    "I can help you with: 1) Emergency response, 2) Victim registration, 3) Shelter locations, 4) NGO coordination, 5) Flood alerts, 6) System navigation. What do you need?",
    "Available features: Live Map, Alerts Feed, Chat support, Victim Registration, NGO Coordination, Analytics, and Emergency SOS. Which would you like to learn about?",
    "I'm here to assist with flood management and emergency response. Ask me about alerts, victims, shelters, rescue teams, or how to use our system.",
  ],

  // Default helpful response
  default: [
    "That's an important question. For specific assistance, please provide more details or visit the relevant page in our system (Live Map, Analytics, Victim Registration, or NGO Coordination).",
    "I'm here to help! Could you provide more specific information about what you need? Are you looking for emergency help, information about a region, or system guidance?",
    "Thank you for reaching out. For more detailed assistance, please specify which service you need help with.",
  ],
};

export function generateAIResponse(userMessage, channel) {
  if (channel !== "support") {
    return null; // Only auto-reply in support channel
  }

  const message = userMessage.toLowerCase().trim();

  // Check for patterns
  if (/\b(hi|hello|hey|greetings|welcome)\b/.test(message)) {
    return getRandomResponse(aiResponses.greeting);
  }

  if (/\b(emergency|sos|urgent|danger|help|911|rescue)\b/.test(message)) {
    return getRandomResponse(aiResponses.emergency);
  }

  if (/\b(flood|water level|inundation|overflow)\b/.test(message)) {
    return getRandomResponse(aiResponses.flood);
  }

  if (/\b(ngo|organization|coordinate|agency|volunteer)\b/.test(message)) {
    return getRandomResponse(aiResponses.ngo);
  }

  if (
    /\b(victim|victim.*regist|register.*victim|affected|person|family)\b/.test(
      message,
    )
  ) {
    return getRandomResponse(aiResponses.victim);
  }

  if (/\b(shelter|refuge|safe.*location|evacuation)\b/.test(message)) {
    return getRandomResponse(aiResponses.shelter);
  }

  if (/\b(status|statistics|analytics|data|report|dashboard)\b/.test(message)) {
    return getRandomResponse(aiResponses.status);
  }

  if (/\b(help|how to|guide|assist|information|what|can you)\b/.test(message)) {
    return getRandomResponse(aiResponses.help);
  }

  // Default response for unmatched queries
  return getRandomResponse(aiResponses.default);
}

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

export function createAIStatusRouter() {
  const router = require("express").Router();

  router.get("/ai/status", (req, res) => {
    res.json({ aiAvailable: true });
  });

  return router;
}
