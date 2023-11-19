import { apiKey } from "./secret.js";

let conversationHistory = [];


document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting and refreshing the page

    const userInput = document.getElementById('user-input').value;
    callChatGptApi(userInput).then(response => {
        displayResponse(userInput, response);
    }).catch(error => {
        console.error('Error calling ChatGPT API:', error);
    });
});

function callChatGptApi(userInput) {

// Add user input to conversation history
conversationHistory.push({ role: "user", content: userInput });
console.log({ role: "user", content: userInput })

    console.log(userInput)
    return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Replace with the specific model you intend to use
            messages: conversationHistory,
            //prompt: [{}]
            max_tokens: 150 // Example value; adjust as needed
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Add chatbot response to conversation history
        const chatbotResponse = data.choices[0].message.content;
        conversationHistory.push({ role: "assistant", content: chatbotResponse });
        return data;
    })
    .catch(error => {
        console.log(`Error: ${error}`)
    });
}

function displayResponse(userInput, apiResponse) {
    const responseArea = document.getElementById('response-area');
    const assistantResponse = apiResponse.choices[0].message.content;
    responseArea.innerHTML += `<div><strong>User:</strong> ${userInput}</div>`;
    responseArea.innerHTML += `<div><strong>ChatGPT:</strong> ${assistantResponse}</div>`;
}
