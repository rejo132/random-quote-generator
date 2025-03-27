// DOM elements
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");
const saveQuoteBtn = document.getElementById("save-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const shareQuoteBtn = document.getElementById("share-quote");
const speakQuoteBtn = document.getElementById("speak-quote");
const clearFavoritesBtn = document.getElementById("clear-favorites");
const categoryFilter = document.getElementById("category");
const favoritesList = document.getElementById("favorites-list");
const spinner = document.getElementById("spinner");
const themeBtn = document.getElementById("theme-btn");

if (!quoteText || !quoteAuthor || !newQuoteBtn || !saveQuoteBtn || !copyQuoteBtn || !shareQuoteBtn || !speakQuoteBtn || !clearFavoritesBtn || !categoryFilter || !favoritesList || !spinner || !themeBtn) {
    console.error("One or more DOM elements not found. Check HTML IDs.");
}

let favorites = JSON.parse(localStorage.getItem("favoriteQuotes")) || [];
renderFavorites();

const API_URL = "https://api.adviceslip.com/advice";
const fakeAuthors = ["Wise Sage", "Daily Muse", "Random Philosopher", "Unknown Elder", "Life Guide", "Thought Weaver", "Silent Poet", "Timeless Voice"];
const staticQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "inspirational" },
    { text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", author: "Stephen Wright", category: "funny" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "inspirational" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "inspirational" }
];

const backgroundImages = [
    "https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Mountains
    "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Lake
    "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Forest
    "https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Ocean sunset
    "https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Snowy peaks
    "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",       // Mountain valley
    "https://images.pexels.com/photos/3493777/pexels-photo-3493777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Waterfall
    "https://images.pexels.com/photos/572688/pexels-photo-572688.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",  // Rolling hills
    "https://images.pexels.com/photos/9754/pexels-photo-9754.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",     // Desert dunes
    "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"   // Coastal cliffs
];

function setRandomBackground() {
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.style.backgroundImage = `url('${randomImage}')`;
}

async function retryFetch(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed with status: ${response.status}`);
            return response;
        } catch (error) {
            if (i < retries - 1) {
                console.log(`Retry ${i + 1}/${retries} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

async function displayRandomQuote() {
    const selectedCategory = categoryFilter.value;

    quoteText.classList.remove("fade-in");
    quoteAuthor.classList.remove("fade-in");
    quoteText.textContent = "";
    quoteAuthor.textContent = "- Unknown";
    spinner.style.display = "block";

    try {
        console.log("Fetching advice from:", API_URL);
        const response = await retryFetch(API_URL);
        const data = await response.json();
        console.log("API response:", data);
        quoteText.textContent = `"${data.slip.advice}"`;
        const randomAuthor = fakeAuthors[Math.floor(Math.random() * fakeAuthors.length)];
        quoteAuthor.textContent = `- ${randomAuthor}`;
        setRandomBackground();
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
        } else {
            const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
            quoteText.textContent = `"${randomQuote.text}"`;
            quoteAuthor.textContent = `- ${randomQuote.author}`;
        }
        setRandomBackground();
    } finally {
        spinner.style.display = "none";
        quoteText.classList.add("fade-in");
        quoteAuthor.classList.add("fade-in");
    }
}

function saveQuote() {
    const currentQuote = {
        text: quoteText.textContent.replace(/"/g, ""),
        author: quoteAuthor.textContent.slice(2),
    };

    if (currentQuote.text === "" || currentQuote.text === "No quotes available for this category.") return;
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

// Theme toggle logic
function updateThemeButtonText() {
    themeBtn.textContent = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light", !document.body.classList.contains("dark"));
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    updateThemeButtonText();
});

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
document.body.classList.add(savedTheme);
updateThemeButtonText();

newQuoteBtn.addEventListener("click", displayRandomQuote);
saveQuoteBtn.addEventListener("click", saveQuote);
copyQuoteBtn.addEventListener("click", () => {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    navigator.clipboard.writeText(quote).then(() => alert("Quote copied!")).catch(err => console.error("Copy failed:", err));
});
shareQuoteBtn.addEventListener("click", () => {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
    window.open(url, "_blank");
});
speakQuoteBtn.addEventListener("click", () => {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    const utterance = new SpeechSynthesisUtterance(quote);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
});
clearFavoritesBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all favorites?")) {
        favorites = [];
        localStorage.setItem("favoriteQuotes", JSON.stringify(favorites));
        renderFavorites();
    }
});
categoryFilter.addEventListener("change", displayRandomQuote);

// Initial load
setRandomBackground();
displayRandomQuote();