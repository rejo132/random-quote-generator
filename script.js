// DOM elements
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");
const saveQuoteBtn = document.getElementById("save-quote");
const categoryFilter = document.getElementById("category");
const favoritesList = document.getElementById("favorites-list");

if (!quoteText || !quoteAuthor || !newQuoteBtn || !saveQuoteBtn || !categoryFilter || !favoritesList) {
    console.error("One or more DOM elements not found. Check HTML IDs.");
}

let favorites = JSON.parse(localStorage.getItem("favoriteQuotes")) || [];
renderFavorites();

// Advice Slip API (primary source)
const API_URL = "https://api.adviceslip.com/advice";

// Fake authors for Advice Slip
const fakeAuthors = [
    "Wise Sage", "Daily Muse", "Random Philosopher", "Unknown Elder",
    "Life Guide", "Thought Weaver", "Silent Poet", "Timeless Voice"
];

// Static fallback quotes with real authors
const staticQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "inspirational" },
    { text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", author: "Stephen Wright", category: "funny" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "inspirational" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "inspirational" }
];

async function displayRandomQuote() {
    const selectedCategory = categoryFilter.value;

    try {
        quoteText.textContent = "Loading advice...";
        quoteAuthor.textContent = "- Unknown";
        console.log("Fetching advice from:", API_URL);

        const response = await fetch(API_URL);
        console.log("Response status:", response.status);
        if (!response.ok) throw new Error(`Failed to fetch advice. Status: ${response.status}`);

        const data = await response.json();
        console.log("API response:", data);
        quoteText.textContent = `"${data.slip.advice}"`;
        const randomAuthor = fakeAuthors[Math.floor(Math.random() * fakeAuthors.length)];
        quoteAuthor.textContent = `- ${randomAuthor}`;
    } catch (error) {
        console.error("API fetch error:", error);
        console.log("Falling back to static quotes...");

        let filteredQuotes = staticQuotes;
        if (selectedCategory !== "all") {
            filteredQuotes = staticQuotes.filter(quote => quote.category === selectedCategory);
        }

        if (filteredQuotes.length === 0) {
            quoteText.textContent = "No quotes available for this category.";
            quoteAuthor.textContent = "- Unknown";
            return;
        }

        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteText.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `- ${randomQuote.author}`;
    }
}

function saveQuote() {
    const currentQuote = {
        text: quoteText.textContent.replace(/"/g, ""),
        author: quoteAuthor.textContent.slice(2),
    };

    if (currentQuote.text === "Loading advice..." || currentQuote.text === "Oops, something went wrong!" || 
        currentQuote.text === "No quotes available for this category.") return;
    
    if (!favorites.some(fav => fav.text === currentQuote.text && fav.author === currentQuote.author)) {
        favorites.push(currentQuote);
        localStorage.setItem("favoriteQuotes", JSON.stringify(favorites));
        renderFavorites();
    }
}

function renderFavorites() {
    favoritesList.innerHTML = "";
    favorites.forEach(fav => {
        const li = document.createElement("li");
        li.textContent = `"${fav.text}" - ${fav.author}`;
        favoritesList.appendChild(li);
    });
}

// Event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
saveQuoteBtn.addEventListener("click", saveQuote);
categoryFilter.addEventListener("change", displayRandomQuote);

// Display a random quote on initial load
displayRandomQuote();