const quotes = [
  {
    text: "Life is what happens while you're busy making other plans.",
    author: "John Lennon",
    category: "life",
  },
  // Life Quotes
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha",
    category: "life",
  },
  {
    text: "Life is ten percent what happens to you and ninety percent how you respond to it.",
    author: "Charles R. Swindoll",
    category: "life",
  },
  {
    text: "Keep your face always toward the sunshine—and shadows will fall behind you.",
    author: "Walt Whitman",
    category: "life",
  },
  // Motivation Quotes
  {
    text: "Dream big and dare to fail.",
    author: "Norman Vaughan",
    category: "motivation",
  },
  {
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "motivation",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation",
  },
  // Wisdom Quotes
  {
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    category: "wisdom",
  },
  {
    text: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
    author: "Albert Einstein",
    category: "wisdom",
  },
  {
    text: "Honesty is the first chapter in the book of wisdom.",
    author: "Thomas Jefferson",
    category: "wisdom",
  },
  // Add more categories as needed...

  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    text: "Be the change you wish to see in the world.",
    author: "Mahatma Gandhi",
    category: "wisdom",
  },
  {
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost",
    category: "life",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "motivation",
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "motivation",
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "wisdom",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "wisdom",
  },
  {
    text: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    category: "life",
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    category: "motivation",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "motivation",
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "life",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "motivation",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "wisdom",
  },
  {
    text: "The best revenge is massive success.",
    author: "Frank Sinatra",
    category: "motivation",
  },
  {
    text: "If you want to live a happy life, tie it to a goal, not to people or things.",
    author: "Albert Einstein",
    category: "wisdom",
  },
  {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    category: "wisdom",
  },
  {
    text: "Everything has beauty, but not everyone can see it.",
    author: "Confucius",
    category: "life",
  },
  {
    text: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller",
    category: "life",
  },
];

let currentCategory = "all";
let currentQuote = null;
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

async function getRandomQuote() {
  const btn = document.getElementById("newQuoteBtn");
  btn.classList.add("loading");

  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    currentQuote = {
      text: data.content,
      author: data.author,
      category: data.tags[0] || "wisdom",
    };

    document.getElementById("mainQuote").textContent = `"${currentQuote.text}"`;
    document.getElementById(
      "mainAuthor"
    ).textContent = `- ${currentQuote.author}`;
  } catch (error) {
    console.error("Error fetching quote:", error);
    // Fallback to local quotes if API fails
    const filteredQuotes =
      currentCategory === "all"
        ? quotes
        : quotes.filter((q) => q.category === currentCategory);

    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      currentQuote = filteredQuotes[randomIndex];
      document.getElementById(
        "mainQuote"
      ).textContent = `"${currentQuote.text}"`;
      document.getElementById(
        "mainAuthor"
      ).textContent = `- ${currentQuote.author}`;
    }
  } finally {
    btn.classList.remove("loading");
    updateFavoriteButton();
  }
}

function copyQuote() {
  if (!currentQuote) return;
  const text = `"${currentQuote.text}" - ${currentQuote.author}`;
  navigator.clipboard
    .writeText(text)
    .then(() => showNotification("Quote copied!"))
    .catch(() => showNotification("Failed to copy"));
}

function updateFavoriteButton() {
  const btn = document.getElementById("favoriteBtn");
  if (!currentQuote) return;
  const isFavorite = favorites.some((f) => f.text === currentQuote.text);
  btn.textContent = isFavorite ? "❤️ Saved" : "❤️ Save";
}

function toggleFavorite() {
  if (!currentQuote) return;

  const index = favorites.findIndex((f) => f.text === currentQuote.text);
  if (index === -1) {
    favorites.push(currentQuote);
    showNotification("Added to favorites!");
  } else {
    favorites.splice(index, 1);
    showNotification("Removed from favorites!");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
  updateFavoriteButton();
}

function shareQuote() {
  if (!currentQuote) return;
  const text = `"${currentQuote.text}" - ${currentQuote.author}`;
  if (navigator.share) {
    navigator
      .share({
        title: "Quote of the Day",
        text: text,
      })
      .catch(() => copyQuote());
  } else {
    copyQuote();
  }
}

async function searchQuotes(event) {
  event.preventDefault();
  const searchTerm = document
    .getElementById("authorSearch")
    .value.toLowerCase();
  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = "<p>Searching...</p>";

  try {
    // First try the external API
    const response = await fetch(
      `https://api.quotable.io/quotes?author=${encodeURIComponent(searchTerm)}`
    );
    if (!response.ok) throw new Error("API call failed");

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      displaySearchResults(
        data.results.map((quote) => ({
          text: quote.content,
          author: quote.author,
        })),
        resultsDiv
      );
      return;
    }

    // If no results from API, fall back to local quotes
    const localResults = quotes.filter((quote) =>
      quote.author.toLowerCase().includes(searchTerm)
    );

    if (localResults.length > 0) {
      displaySearchResults(localResults, resultsDiv);
    } else {
      resultsDiv.innerHTML =
        '<p class="search-result">No quotes found for this author.</p>';
    }
  } catch (error) {
    // If API fails, search local quotes
    const localResults = quotes.filter((quote) =>
      quote.author.toLowerCase().includes(searchTerm)
    );

    if (localResults.length > 0) {
      displaySearchResults(localResults, resultsDiv);
    } else {
      resultsDiv.innerHTML =
        '<p class="search-result">No quotes found for this author.</p>';
    }
  }
}

function displaySearchResults(results, container) {
  container.innerHTML = results
    .map(
      (quote) => `
        <div class="search-result">
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">- ${quote.author}</p>
        </div>
    `
    )
    .join("");
}

function displayFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML =
    favorites.length === 0
      ? '<p class="search-result">No favorite quotes yet.</p>'
      : favorites
          .map(
            (quote) => `
            <div class="search-result">
                <p class="quote-text">"${quote.text}"</p>
                <p class="quote-author">- ${quote.author}</p>
            </div>
        `
          )
          .join("");
}

document.querySelectorAll(".category-tag").forEach((tag) => {
  tag.addEventListener("click", () => {
    document
      .querySelectorAll(".category-tag")
      .forEach((t) => t.classList.remove("active"));
    tag.classList.add("active");
    currentCategory = tag.dataset.category;
    getRandomQuote();
  });
});
// Remove Quote
function displayFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML =
    favorites.length === 0
      ? '<p class="search-result">No favorite quotes yet.</p>'
      : favorites
          .map(
            (quote, index) => `
    <div class="search-result">
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-author">- ${quote.author}</p>
        <button onclick="removeFavorite(${index})" class="remove-button">Remove</button>
    </div>
`
          )
          .join("");
}

function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
  showNotification("Quote removed from favorites!");
}

// Remove Quote

// //Create Backend Code
// const express = require("express");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MySQL Connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "your_password",
//   database: "quote_of_the_day",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   }
//   console.log("Connected to MySQL database.");
// });

// // Routes
// // Get all quotes
// app.get("/quotes", (req, res) => {
//   const query = "SELECT * FROM quotes";
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });

// // Add a favorite quote
// app.post("/favorites", (req, res) => {
//   const { text, author, category } = req.body;
//   const query =
//     "INSERT INTO favorites (text, author, category) VALUES (?, ?, ?)";
//   db.query(query, [text, author, category], (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "Favorite added!", id: results.insertId });
//   });
// });

// // Get all favorite quotes
// app.get("/favorites", (req, res) => {
//   const query = "SELECT * FROM favorites";
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });

// // Delete a favorite quote
// app.delete("/favorites/:id", (req, res) => {
//   const { id } = req.params;
//   const query = "DELETE FROM favorites WHERE id = ?";
//   db.query(query, [id], (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "Favorite removed!" });
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// async function getQuote() {
//   try {
//     const response = await fetch("http://localhost:3000/api/quote");
//     const data = await response.json();
//     document.getElementById("mainQuote").innerText = data.text;
//     document.getElementById("mainAuthor").innerText = data.author;
//   } catch (error) {
//     console.error("Error fetching quote:", error);
//   }
// }

//Create Backend Code
// Initialize
getRandomQuote();
displayFavorites();
