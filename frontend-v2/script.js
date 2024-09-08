// Improved Markdown to HTML conversion function
function markdownToHtml(markdown) {
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/^\* (.*)/gm, '<li>$1</li>') // List items starting with *
        .replace(/^- (.*)/gm, '<li>$1</li>') // List items starting with -
        .replace(/<li>.*?<\/li>/gs, match => `<ul>${match}</ul>`) // Wrap list items in <ul>
        .replace(/\n/g, '<br>'); // Convert newlines to <br> tags
}

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const collegeSelect = document.getElementById("college-select");
const languageSelect = document.getElementById("language-select");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

// Add variables for college and language
let collegeName = "gpcajmer"; // Default value
let language = "English"; // Default value

// Function to set college name
function setCollegeName(name) {
    collegeName = name;
}

// Function to set language
function setLanguage(lang) {
    language = lang;
}

// Event listeners for dropdowns
collegeSelect.addEventListener("change", function() {
    setCollegeName(this.value);
});

languageSelect.addEventListener("change", function() {
    setLanguage(this.value);
});

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = 
        className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message;
    return chatLi;
};

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: userMessage,
            college_name: collegeName,
            lang: language
        }),
    };

    fetch("http://localhost:8000/ask_query", requestOptions)
        .then((res) => res.json())
        .then((data) => {
            messageElement.innerHTML = markdownToHtml(data.answer);
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent =
                "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
);