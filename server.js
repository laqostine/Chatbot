
const express = require('express');
const expressWs = require('express-ws')(express());
const app = expressWs.app;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = "AIzaSyCt4F5c3OBBkmUNRPo_Go4lbR7G8QQK7MA";
const MODEL_NAME = "gemini-1.0-pro";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });


const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, serverTimestamp } = require('firebase/database');


const firebaseConfig = {
  
};


const firebaseApp = initializeApp(firebaseConfig);


const db = getDatabase(firebaseApp);

app.use(express.static('public'));

app.ws('/chat', async function(ws, req) {
  ws.on('message', async function(msg) {
    console.log('Received message: ' + msg);
    if (msg.includes("tyt")) {
    
      push(ref(db, 'messages'), {
        text: msg,
        timestamp: serverTimestamp()
      });
    }
    try {
      const chat = model.startChat({
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [],
        history: [],
      });

      const result = await chat.sendMessage(msg);
      const responseText = result.response.text();
      ws.send(responseText);
      if (responseText.includes("tyt")) {
        console.log("tyt net");
      }
    } catch (error) {
      console.error('Error:', error);
      ws.send('Error occurred: ' + error.message);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
