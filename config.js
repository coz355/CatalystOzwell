// API Configuration
const API_CONFIG = {
    // Cloudflare Tunnel endpoint (ai.catalystozwell.com)
    AI_API_URL: "https://ai.catalystozwell.com/v1/chat/completions",

    // LM Studio local endpoint (fallback for testing)
    LOCAL_API_URL: "http://10.5.0.2:1234/v1/chat/completions",

    // Model settings
    MODEL: "mistralai/mistral-7b-instruct-v0.3",
    MAX_TOKENS: 2048,
    TEMPERATURE: 0.7,
};

// Export for app.js
window.API_CONFIG = API_CONFIG;
