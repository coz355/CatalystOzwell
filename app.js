document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    // Add message to chat
    const addMessage = (message, isUser = false) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(isUser ? "user-message" : "bot-message");
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Call AI API
    const callAI = async (prompt) => {
        addMessage(prompt, true);
        addMessage("Thinking...", false);

        try {
            const response = await fetch(API_CONFIG.AI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: API_CONFIG.MODEL,
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: API_CONFIG.MAX_TOKENS,
                    temperature: API_CONFIG.TEMPERATURE,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            chatMessages.removeChild(chatMessages.lastChild); // Remove "Thinking..."
            addMessage(aiResponse, false);
        } catch (error) {
            chatMessages.removeChild(chatMessages.lastChild); // Remove "Thinking..."
            addMessage(`Error: ${error.message}`, false);
            console.error("AI API Error:", error);
        }
    };

    // Event listeners
    sendButton.addEventListener("click", () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            callAI(prompt);
            userInput.value = "";
        }
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
});
