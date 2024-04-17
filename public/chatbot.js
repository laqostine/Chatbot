const ws = new WebSocket('ws://localhost:3000/chat');

ws.onmessage = function (event) {
    const message = event.data;
    displayMessage(`Bot: ${message}`);
};

function sendMessage() {
    const inputElement = document.getElementById('userInput');
    const message = inputElement.value;
    if (message.includes("tyt")) {
        console.log("merhaba");
    }
    displayMessage(`You: ${message}`);
    ws.send(message);
    inputElement.value = '';
}

function displayMessage(message) {
    const messagesElement = document.getElementById('messages');
    const messageElement = document.createElement('li');
    messageElement.innerHTML = message; 
    messagesElement.appendChild(messageElement);
}
