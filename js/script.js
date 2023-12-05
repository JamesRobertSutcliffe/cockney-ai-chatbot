import { apiKey } from "../assets/js/secret.js";

let conversationHistory = [{ role: "assistant", content: "Always respond in cockney dialect." }];

document.getElementById('chat-form').addEventListener('submit', respond)

const responseArea = document.getElementById('response-area');

function respond(event) {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    const userInput = document.getElementById('user-input').value;
    const userInputArea = document.getElementById('user-input')

    responseArea.innerHTML += `<div><strong>User:</strong> ${userInput}</div>`;

    callChatGptApi(userInput).then(response => {
        displayResponse(response);
    }).catch(error => {
        console.error('Error calling ChatGPT API:', error);
    });
    userInputArea.value = "";
};

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
            max_tokens: 1500 // Example value; adjust as needed
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

function displayResponse(apiResponse) {
    const assistantResponse = apiResponse.choices[0].message.content;
    responseArea.innerHTML += `<div><strong>ChatGPT:</strong> ${assistantResponse}</div>`;
}
