class AIService {
    constructor() {
        this.settings = this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('zettelSettings');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading AI settings:', error);
            return null;
        }
    }

    updateSettings(newSettings) {
        this.settings = newSettings;
    }

    async generateResponse(message) {
        if (!this.settings) {
            return "Please configure your AI settings first by clicking the settings icon.";
        }

        const provider = this.settings.aiProvider;
        const apiKey = this.settings.apiKeys[provider];
        const model = this.settings.models[provider];

        if (!apiKey) {
            return `Please add your ${provider.toUpperCase()} API key in settings.`;
        }

        try {
            switch (provider) {
                case 'openai':
                    return await this.callOpenAI(apiKey, model, message);
                case 'gemini':
                    return await this.callGemini(apiKey, model, message);
                case 'openrouter':
                    return await this.callOpenRouter(apiKey, model, message);
                default:
                    return "Unknown AI provider selected.";
            }
        } catch (error) {
            console.error('AI request error:', error);
            return `Error communicating with ${provider.toUpperCase()}: ${error.message}`;
        }
    }

    async *generateStreamingResponse(message, onChunk) {
        if (!this.settings) {
            yield "Please configure your AI settings first by clicking the settings icon.";
            return;
        }

        const provider = this.settings.aiProvider;
        const apiKey = this.settings.apiKeys[provider];
        const model = this.settings.models[provider];

        if (!apiKey) {
            yield `Please add your ${provider.toUpperCase()} API key in settings.`;
            return;
        }

        try {
            switch (provider) {
                case 'openai':
                    yield* this.callOpenAIStreaming(apiKey, model, message);
                    break;
                case 'gemini':
                    yield* this.callGeminiStreaming(apiKey, model, message);
                    break;
                case 'openrouter':
                    yield* this.callOpenRouterStreaming(apiKey, model, message);
                    break;
                default:
                    yield "Unknown AI provider selected.";
            }
        } catch (error) {
            console.error('AI streaming error:', error);
            yield `Error communicating with ${provider.toUpperCase()}: ${error.message}`;
        }
    }

    async callOpenAI(apiKey, model, message) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { 
                        role: 'system', 
                        content: this.settings.advanced.systemPrompt 
                    },
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                max_tokens: this.settings.advanced.maxTokens,
                temperature: this.settings.advanced.temperature
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    async callGemini(apiKey, model, message) {
        const systemMessage = this.settings.advanced.systemPrompt;
        const fullMessage = `${systemMessage}\n\nUser: ${message}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: fullMessage }]
                }],
                generationConfig: {
                    temperature: this.settings.advanced.temperature,
                    maxOutputTokens: this.settings.advanced.maxTokens
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API request failed');
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
        }

        return data.candidates[0].content.parts[0].text.trim();
    }

    async callOpenRouter(apiKey, model, message) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://zettel-widget.app',
                'X-Title': 'Zettel Widget'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { 
                        role: 'system', 
                        content: this.settings.advanced.systemPrompt 
                    },
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                max_tokens: this.settings.advanced.maxTokens,
                temperature: this.settings.advanced.temperature
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenRouter API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // Utility method to format responses
    formatResponse(text) {
        // Add some basic formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    // Method to estimate token count (rough approximation)
    estimateTokens(text) {
        return Math.ceil(text.length / 4);
    }

    // Streaming methods for real-time responses
    async *callOpenAIStreaming(apiKey, model, message) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { 
                        role: 'system', 
                        content: this.settings.advanced.systemPrompt 
                    },
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                max_tokens: this.settings.advanced.maxTokens,
                temperature: this.settings.advanced.temperature,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(data);
                            const delta = parsed.choices?.[0]?.delta?.content;
                            if (delta) {
                                yield delta;
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    async *callGeminiStreaming(apiKey, model, message) {
        // Gemini doesn't support streaming in the same way, so we'll simulate it
        const response = await this.callGemini(apiKey, model, message);
        const words = response.split(' ');
        
        for (let i = 0; i < words.length; i++) {
            yield words[i] + (i < words.length - 1 ? ' ' : '');
            // Small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async *callOpenRouterStreaming(apiKey, model, message) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://zettel.com',
                'X-Title': 'Zettel AI Assistant'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { 
                        role: 'system', 
                        content: this.settings.advanced.systemPrompt 
                    },
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                max_tokens: this.settings.advanced.maxTokens,
                temperature: this.settings.advanced.temperature,
                stream: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
                const error = JSON.parse(errorText);
                errorMessage = error.error?.message || 'OpenRouter API request failed';
            } catch {
                errorMessage = `OpenRouter API request failed: ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(data);
                            const delta = parsed.choices?.[0]?.delta?.content;
                            if (delta) {
                                yield delta;
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    // Method to check if API key is configured
    isConfigured() {
        if (!this.settings) return false;
        const provider = this.settings.aiProvider;
        return !!this.settings.apiKeys[provider];
    }

    // Method to get current provider info
    getProviderInfo() {
        if (!this.settings) return null;
        
        return {
            provider: this.settings.aiProvider,
            model: this.settings.models[this.settings.aiProvider],
            configured: this.isConfigured()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
} else {
    window.AIService = AIService;
}
