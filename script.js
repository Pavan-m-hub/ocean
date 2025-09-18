const API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; // Replace with your actual API key
const API_URL = 'https://api.openai.com/v1/chat/completions';

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, 'user');
    userInput.value = '';

    // Call AI
    getBotResponse(message);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotResponse(userMessage) {
    const prompt = `You are FLOATCHAT, an expert AI on oceans and marine life. Answer questions related to oceans, sea creatures, conservation, weather, tides, and all things sea-related. Be helpful, informative, and engaging. If the question is not ocean-related, politely redirect to ocean topics. Use ocean-related emojis occasionally to make responses more fun. 🌊🐟🦑

User: ${userMessage}`;

    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message', 'typing');
    typingDiv.innerHTML = '🌊 FLOATCHAT is thinking<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{role: 'system', content: prompt}],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content.trim();

        // Remove typing indicator
        chatBox.removeChild(typingDiv);

        typeMessage(botMessage, 'bot');
    } catch (error) {
        // Remove typing indicator
        chatBox.removeChild(typingDiv);
        typeMessage('Sorry, I encountered an error. Please try again. 🌊', 'bot');
        console.error('Error:', error);
    }
}

function typeMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    chatBox.appendChild(messageDiv);

    let i = 0;
    const timer = setInterval(() => {
        messageDiv.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }, 50); // Adjust speed here
}

// Initial greeting
addMessage('Hello! I\'m FLOATCHAT, your ocean expert. Ask me anything about the sea!', 'bot');