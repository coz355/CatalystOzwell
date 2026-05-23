/* ============================================
   CATALYST OZWELL - APP LOGIC WITH THEME SYSTEM
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const themeSwitcher = document.getElementById("theme-switcher");
    const body = document.body;

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    // Available Themes with Latin Names
    const THEMES = {
        "lux-neon-violet": "Lux Violaceum (Violet Neon)",
        "lux-neon-cyan": "Lux Cyan (Cyan Neon)",
        "lux-neon-magenta": "Lux Magentum (Magenta Neon)",
        "opus-deco-gold": "Opus Aureum (Gold Deco)",
        "opus-deco-emerald": "Opus Smaragdus (Emerald Deco)",
        "opus-deco-sapphire": "Opus Sapphirinus (Sapphire Deco)"
    };

    // Default theme
    const DEFAULT_THEME = "lux-neon-violet";

    // Load theme from localStorage or set default
    const loadTheme = () => {
        const savedTheme = localStorage.getItem("catalystTheme") || DEFAULT_THEME;
        setTheme(savedTheme);
    };

    // Set active theme
    const setTheme = (themeName) => {
        // Remove all theme classes
        Object.keys(THEMES).forEach(theme => {
            body.classList.remove(theme);
        });
        
        // Add selected theme
        body.classList.add(themeName);
        themeSwitcher.value = themeName;
        localStorage.setItem("catalystTheme", themeName);
        
        console.log(`✨ Theme Changed: ${THEMES[themeName]}`);
    };

    // Theme switcher event listener
    themeSwitcher.addEventListener("change", (e) => {
        setTheme(e.target.value);
    });

    // ============================================
    // MESSAGE HANDLING
    // ============================================

    // Add message to chat
    const addMessage = (message, isUser = false) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(isUser ? "user-message" : "bot-message");
        
        // Escape HTML to prevent XSS
        messageDiv.textContent = message;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Clear chat
    const clearChat = () => {
        chatMessages.innerHTML = "";
        console.log("💬 Chat cleared");
    };

    // ============================================
    // API COMMUNICATION
    // ============================================

    // Call AI API with retry logic
    const callAI = async (prompt) => {
        if (!prompt || prompt.trim().length === 0) {
            return;
        }

        // Disable input during request
        userInput.disabled = true;
        sendButton.disabled = true;

        addMessage(prompt, true);
        addMessage("🤔 Thinking...", false);

        const maxRetries = 3;
        let retryCount = 0;
        const timeoutMs = 30000; // 30 second timeout

        const attemptRequest = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

                const response = await fetch(API_CONFIG.AI_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: API_CONFIG.MODEL,
                        messages: [
                            {
                                role: "system",
                                content: "You are CatalystOZWELL, an advanced AI assistant providing helpful suggestions and information. IMPORTANT: All responses are suggestions only. The user must verify information independently. You are not responsible for decisions made based on your responses."
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        max_tokens: API_CONFIG.MAX_TOKENS,
                        temperature: API_CONFIG.TEMPERATURE,
                        stream: false,
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                
                // Validate response structure
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    throw new Error("Invalid API response structure");
                }

                const aiResponse = data.choices[0].message.content;
                
                // Remove "Thinking..." message
                const lastMessage = chatMessages.lastChild;
                if (lastMessage && lastMessage.textContent.includes("Thinking")) {
                    chatMessages.removeChild(lastMessage);
                }
                
                addMessage(aiResponse, false);
                
                // Log success
                console.log(`✅ AI Response received (${aiResponse.length} chars)`);

            } catch (error) {
                retryCount++;

                if (error.name === "AbortError") {
                    const timeoutMsg = `⏱️ Request timeout after ${timeoutMs / 1000}s. ${retryCount < maxRetries ? `Retrying... (${retryCount}/${maxRetries})` : "Failed after max retries."}`;
                    console.error(timeoutMsg, error);
                    
                    // Remove "Thinking..." message
                    const lastMessage = chatMessages.lastChild;
                    if (lastMessage && lastMessage.textContent.includes("Thinking")) {
                        chatMessages.removeChild(lastMessage);
                    }
                    
                    if (retryCount < maxRetries) {
                        // Wait before retry (exponential backoff)
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount - 1) * 1000));
                        return attemptRequest();
                    } else {
                        addMessage(timeoutMsg, false);
                    }
                } else if (retryCount < maxRetries) {
                    const errorMsg = `⚠️ Error: ${error.message}. Retrying... (${retryCount}/${maxRetries})`;
                    console.warn(errorMsg, error);
                    
                    // Remove "Thinking..." message
                    const lastMessage = chatMessages.lastChild;
                    if (lastMessage && lastMessage.textContent.includes("Thinking")) {
                        chatMessages.removeChild(lastMessage);
                    }
                    
                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount - 1) * 1000));
                    return attemptRequest();
                } else {
                    const finalErrorMsg = `❌ Error after ${maxRetries} retries: ${error.message}`;
                    console.error(finalErrorMsg, error);
                    
                    // Remove "Thinking..." message
                    const lastMessage = chatMessages.lastChild;
                    if (lastMessage && lastMessage.textContent.includes("Thinking")) {
                        chatMessages.removeChild(lastMessage);
                    }
                    
                    addMessage(finalErrorMsg, false);
                }
            } finally {
                // Re-enable input after request completes
                userInput.disabled = false;
                sendButton.disabled = false;
            }
        };

        await attemptRequest();
    };

    // ============================================
    // EVENT LISTENERS
    // ============================================

    // Send button click
    sendButton.addEventListener("click", () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            callAI(prompt);
            userInput.value = "";
            userInput.focus();
        }
    });

    // Enter key to send
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================

    // Load saved theme on startup
    loadTheme();

    // Welcome message
    const welcomeMsg = `🎉 Welcome to CatalystOZWELL!\n\n📋 DISCLAIMER: All responses are suggestions only. Information is not guaranteed to be accurate. Please verify all information independently. We are not responsible for any decisions or actions based on AI responses.\n\nTry asking me anything!`;
    addMessage(welcomeMsg, false);

    // Log initialization
    console.log("✅ CatalystOZWELL initialized");
    console.log(`🎨 Available themes: ${Object.keys(THEMES).length}`);
    console.log("💬 Ready for chat...");

    // Expose API for debugging (optional)
    window.catalyst = {
        clearChat,
        callAI,
        setTheme,
        getTheme: () => localStorage.getItem("catalystTheme"),
        themes: THEMES
    };
});
