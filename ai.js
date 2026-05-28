/**
 * CozWELL AI Module v1.0
 * Drop-in module for local Mistral + Gemma models via LM Studio
 * 
 * Usage:
 *   <script src="ai.js"></script>
 *   <script>
 *     CozWELL_AI.init({
 *       baseUrl: "http://192.168.178.72:1234/v1",
 *       defaultModel: "mistralai/mistral-7b-instruct-v0.3"
 *     });
 *   </script>
 */

window.CozWELL_AI = (function () {
    let config = {
        baseUrl: "http://192.168.178.72:1234/v1",
        defaultModel: "mistralai/mistral-7b-instruct-v0.3",
        gemmaModel: "google/gemma-4-e4b"
    };

    let histories = {
        edu: [],
        well: [],
        eng: []
    };

    // ==================== CORE MODEL CALL ====================
    async function callLocalModel(messages, model, onToken, temperature = 0.7, maxTokens = 1600) {
        const body = {
            model: model || config.defaultModel,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: true
        };

        const res = await fetch(`${config.baseUrl}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok || !res.body) throw new Error("Local model request failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(l => l.trim().startsWith("data:"));

            for (const line of lines) {
                const data = line.replace("data:", "").trim();
                if (data === "[DONE]") continue;
                try {
                    const json = JSON.parse(data);
                    const delta = json.choices?.[0]?.delta?.content || "";
                    if (delta) {
                        full += delta;
                        if (onToken) onToken(delta, full);
                    }
                } catch (_) {}
            }
        }
        return full;
    }

    // ==================== SYSTEM PROMPTS ====================
    const systemPrompts = {
        well: "You are Vitalis, a calm, empathetic, and practical wellbeing coach. Give short, actionable advice. Never give medical diagnoses. Be warm and grounded.",
        eng:  "You are Forge, a precise, no-nonsense engineering mentor. Think step-by-step. Give structured, practical technical advice. Ask clarifying questions when needed.",
        edu:  "You are EduMentor, an excellent, encouraging academic tutor who explains concepts with clarity and depth."
    };

    // ==================== PUBLIC API ====================

    return {
        // Initialize the module
        init(userConfig = {}) {
            config = { ...config, ...userConfig };
            console.log("%c[CozWELL AI] Module initialized", "color:#67e8f9");
        },

        // Update the LM Studio URL at runtime
        setBaseUrl(url) {
            config.baseUrl = url;
        },

        getConfig() {
            return { ...config };
        },

        // Check if local models are reachable
        async checkConnection() {
            try {
                const r = await fetch(`${config.baseUrl}/models`);
                return r.ok;
            } catch {
                return false;
            }
        },

        // ==================== EDUCATION — 3-INPUT ACADEMIC VERIFIER ====================
        async gradeAcademicAnswer(question, userAnswer, model = null) {
            if (!question || !userAnswer) throw new Error("Both question and answer are required");

            const selectedModel = model || config.defaultModel;

            const system = `You are an expert, fair, and encouraging academic grader.
Respond ONLY with valid JSON in this exact format:
{
  "score": 82,
  "reasoning": "Clear, constructive feedback...",
  "perfect_answer": "The ideal high-scoring answer..."
}`;

            const messages = [
                { role: "system", content: system },
                { role: "user", content: `Question:\n${question}\n\nStudent Answer:\n${userAnswer}` }
            ];

            const raw = await callLocalModel(messages, selectedModel, null, 0.25, 1200);

            // Robust JSON extraction
            let parsed;
            try {
                const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0];
                parsed = jsonStr ? JSON.parse(jsonStr) : null;
            } catch {
                parsed = null;
            }

            if (!parsed) {
                parsed = {
                    score: 65,
                    reasoning: raw.slice(0, 900),
                    perfect_answer: "Model response (truncated):\n" + raw.slice(900, 1600)
                };
            }
            return { ...parsed, modelUsed: selectedModel };
        },

        // General education question (streaming)
        async askGeneralEducation(prompt, onToken, model = null) {
            const selectedModel = model || config.defaultModel;
            histories.edu = histories.edu || [];
            histories.edu.push({ role: "user", content: prompt });

            const messages = [
                { role: "system", content: systemPrompts.edu },
                ...histories.edu.slice(-8)
            ];

            const reply = await callLocalModel(messages, selectedModel, onToken, 0.65);
            histories.edu.push({ role: "assistant", content: reply });
            return reply;
        },

        // ==================== HEALTH (Vitalis) ====================
        async sendToVitalis(prompt, onToken, model = null) {
            const selectedModel = model || config.defaultModel;
            histories.well = histories.well || [];
            histories.well.push({ role: "user", content: prompt });

            const messages = [
                { role: "system", content: systemPrompts.well },
                ...histories.well.slice(-8)
            ];

            const reply = await callLocalModel(messages, selectedModel, onToken, 0.75);
            histories.well.push({ role: "assistant", content: reply });
            return reply;
        },

        // ==================== ENGINEERING (Forge) ====================
        async sendToForge(prompt, onToken, model = null) {
            const selectedModel = model || config.defaultModel;
            histories.eng = histories.eng || [];
            histories.eng.push({ role: "user", content: prompt });

            const messages = [
                { role: "system", content: systemPrompts.eng },
                ...histories.eng.slice(-8)
            ];

            const reply = await callLocalModel(messages, selectedModel, onToken, 0.6);
            histories.eng.push({ role: "assistant", content: reply });
            return reply;
        },

        // Clear specific agent history
        clearHistory(agent) {
            if (histories[agent]) histories[agent] = [];
        },

        // Get current histories (useful for debugging)
        getHistories() {
            return { ...histories };
        }
    };
})();
