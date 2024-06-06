document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message) {
        addMessageToChat('You', message);
        messageInput.value = '';

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
}

function addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = `${sender}: ${message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function adduserMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message_us';
    messageElement.textContent = `${sender}: ${message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function fetchMessages() {
    try {
        const response = await fetch('/api/messages');
        if (response.ok) {
            const data = await response.json();
            if (data && data.message) {
                adduserMessageToChat(data.sender, data.message);
            }
        } else {
            console.error('Failed to fetch messages:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

setInterval(fetchMessages, 5000);

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        themeToggle.innerText = 'Switch to white Mode';
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        themeToggle.textContent = 'Switch to Dark Mode';
    }
}
