document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
    const chatOptions = document.querySelectorAll('.chat-option');
    const app = document.getElementById('app');
    const floatingEffects = document.getElementById('floating-effects');
    const backgroundPattern = document.getElementById('background-pattern');
    const extraButtons = document.querySelectorAll('.extra-button');
    const emojiButton = document.getElementById('emoji-button');
    const platformIndicator = document.getElementById('platform-indicator');
    
    let currentTheme = 'whatsapp';
    
    // Initialize
    setBackgroundPattern(currentTheme);
    addWelcomeMessage();
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    chatOptions.forEach(option => {
        option.addEventListener('click', function() {
            switchChatTheme(this.dataset.chat);
        });
    });
    
    extraButtons.forEach(button => {
        button.addEventListener('click', function() {
            animateExtraButton(this);
        });
    });
    
    emojiButton.addEventListener('click', function() {
        this.classList.toggle('active');
        // In a real app, you'd show an emoji picker here
        addFloatingEmoji('😀');
    });
    
    // Set up message polling
    setInterval(fetchMessages, 5000);
    
    // Functions
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Add message to UI immediately
            addMessageToChat('sent', message);
            messageInput.value = '';
            
            try {
                const response = await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message }),
                });

                if (!response.ok) throw new Error('Network response was not ok');
            } catch (error) {
                console.error('Fetch error:', error);
                // Show error message in UI
                addSystemMessage('Failed to send message. Please try again.');
            }
        }
    }
    
    async function fetchMessages() {
        try {
            const response = await fetch('/api/messages');
            if (response.ok) {
                const data = await response.json();
                if (data && data.message) {
                    addMessageToChat('received', data.message, data.sender || 'User');
                }
            } else {
                console.error('Failed to fetch messages:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
    
    function addMessageToChat(type, message, sender = 'You') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        
        if (type === 'sent') {
            messageElement.innerHTML = `
                ${message}
                <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            `;
            
            // Add floating emoji effects for certain words
            addReactionEmojis(message);
        } else if (type === 'received') {
            messageElement.innerHTML = `
                <strong>${sender}:</strong> ${message}
                <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            `;
            
            // Show typing indicator before message
            showTypingIndicator();
            setTimeout(() => {
                const typing = document.querySelector('.typing-indicator');
                if (typing) typing.remove();
                messagesContainer.appendChild(messageElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000 + Math.random() * 1000);
            return;
        }
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function addSystemMessage(message) {
        const systemElement = document.createElement('div');
        systemElement.classList.add('message', 'system');
        systemElement.textContent = message;
        messagesContainer.appendChild(systemElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function addWelcomeMessage() {
        const welcomeMessages = {
            whatsapp: "Welcome to WhatsApp! Your messages are end-to-end encrypted.",
            instagram: "Welcome to Instagram DMs! Send disappearing photos and videos.",
            telegram: "Welcome to Telegram! Your messages are cloud encrypted."
        };
        
        addSystemMessage(welcomeMessages[currentTheme]);
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') 
            ? '☀️ Light Mode' 
            : '🌙 Dark Mode';
    }
    
    function switchChatTheme(theme) {
        currentTheme = theme;
        
        // Update active button
        chatOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`.chat-option[data-chat="${theme}"]`).classList.add('active');
        
        // Update theme classes
        messagesContainer.classList.remove('whatsapp-theme', 'instagram-theme', 'telegram-theme');
        document.getElementById('input-container').classList.remove('whatsapp-theme', 'instagram-theme', 'telegram-theme');
        
        messagesContainer.classList.add(`${theme}-theme`);
        document.getElementById('input-container').classList.add(`${theme}-theme`);
        
        // Update platform indicator
        updatePlatformIndicator(theme);
        
        // Update background pattern
        setBackgroundPattern(theme);
        
        // Change send button color
        updateSendButtonColor(theme);
        
        // Add welcome message
        addWelcomeMessage();
    }
    
    function updatePlatformIndicator(theme) {
        const icons = {
            whatsapp: 'fab fa-whatsapp',
            instagram: 'fab fa-instagram',
            telegram: 'fab fa-telegram'
        };
        
        const names = {
            whatsapp: 'WhatsApp',
            instagram: 'Instagram',
            telegram: 'Telegram'
        };
        
        platformIndicator.innerHTML = `
            <i class="${icons[theme]}"></i>
            <span>${names[theme]}</span>
        `;
    }
    
    function updateSendButtonColor(theme) {
        const colors = {
            whatsapp: 'var(--whatsapp-primary)',
            instagram: 'linear-gradient(45deg, var(--instagram-primary), var(--instagram-secondary), var(--instagram-tertiary))',
            telegram: 'var(--telegram-primary)'
        };
        document.getElementById('send-button').style.background = colors[theme];
    }
    
    function setBackgroundPattern(theme) {
        backgroundPattern.innerHTML = '';
        floatingEffects.innerHTML = '';
        
        const patterns = {
            whatsapp: ['💬', '📱', '✏️', '🔒'],
            instagram: ['📸', '🌈', '❤️', '✨'],
            telegram: ['✈️', '🔒', '📨', '🌐']
        };
        
        // Create background pattern
        patterns[theme].forEach(emoji => {
            for (let i = 0; i < 8; i++) {
                const element = document.createElement('div');
                element.classList.add('floating-bg-element');
                element.textContent = emoji;
                element.style.left = `${Math.random() * 100}%`;
                element.style.top = `${Math.random() * 100}%`;
                element.style.fontSize = `${Math.random() * 20 + 10}px`;
                element.style.animationDuration = `${Math.random() * 20 + 10}s`;
                element.style.animationDelay = `${Math.random() * 5}s`;
                backgroundPattern.appendChild(element);
            }
        });
    }
    
    function addReactionEmojis(message) {
        if (message.includes('❤️') || message.toLowerCase().includes('love')) {
            createFloatingEmoji('❤️');
        }
        if (message.includes('😂') || message.toLowerCase().includes('haha') || message.toLowerCase().includes('lol')) {
            createFloatingEmoji('😂');
        }
        if (message.includes('🔥') || message.toLowerCase().includes('amazing') || message.toLowerCase().includes('wow')) {
            createFloatingEmoji('🔥');
        }
        if (message.includes('?') || message.toLowerCase().includes('why') || message.toLowerCase().includes('how')) {
            createFloatingEmoji('❓');
        }
    }
    
    function createFloatingEmoji(emoji) {
        const element = document.createElement('div');
        element.classList.add('floating-emoji');
        element.textContent = emoji;
        element.style.left = `${Math.random() * 80 + 10}%`;
        floatingEffects.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 4000);
    }
    
    function animateExtraButton(button) {
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 300);
        
        // Add different effects based on button
        const icons = {
            'fa-paperclip': '📎',
            'fa-camera': '📷',
            'fa-microphone': '🎤'
        };
        
        for (const [cls, emoji] of Object.entries(icons)) {
            if (button.querySelector(`.${cls}`)) {
                createFloatingEmoji(emoji);
                break;
            }
        }
    }
    
    function addFloatingEmoji(emoji) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFloatingEmoji(emoji);
            }, i * 300);
        }
    }
});