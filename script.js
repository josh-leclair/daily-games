// --- 1. CONFIGURATION ---
const games = [
    { 
        name: "Wordle", 
        url: "https://www.nytimes.com/games/wordle/index.html", 
        cat: "Word",
        desc: "Guess the hidden 5-letter word in 6 tries. Colors indicate correct letters." 
    },
    { 
        name: "Connections", 
        url: "https://www.nytimes.com/games/connections", 
        cat: "Logic",
        desc: "Group 16 words into 4 common categories. A test of lateral thinking." 
    },
    { 
        name: "Worldle", 
        url: "https://worldle.teuteuf.fr/", 
        cat: "Geography",
        desc: "Guess the country by its shape. You get distance and direction clues." 
    },
    { 
        name: "Travle", 
        url: "https://travle.earth/", 
        cat: "Geography",
        desc: "Connect two countries by naming the countries in between them." 
    },
    { 
        name: "Costcodle", 
        url: "https://costcodle.com/", 
        cat: "Trivia",
        desc: "Guess the price of a random Costco item. Higher or lower logic." 
    },
    { 
        name: "Bandle", 
        url: "https://bandle.app/", 
        cat: "Music",
        desc: "Guess the song as instruments are added one by one (Drums, Bass, etc)." 
    },
    { 
        name: "TimeGuessr", 
        url: "https://timeguessr.com/", 
        cat: "History",
        desc: "Pinpoint the year and location of a historical photograph." 
    },
    { 
        name: "Waffle", 
        url: "https://wafflegame.net/", 
        cat: "Word",
        desc: "Rearrange the letters in the waffle grid to form 6 words." 
    },
    { 
        name: "Box Office Game", 
        url: "https://boxofficega.me/", 
        cat: "Trivia",
        desc: "Guess the top 5 movies at the box office for a specific weekend in history." 
    },
    { 
        name: "Contexto", 
        url: "https://contexto.me/", 
        cat: "Logic",
        desc: "Find the secret word by guessing related words. Uses AI similarity scoring." 
    },
    { 
        name: "Framed", 
        url: "https://framed.wtf/", 
        cat: "Movies",
        desc: "Guess the movie from a single frame. The frames get easier with each guess." 
    },
    { 
        name: "Kinda Hard Golf", 
        url: "https://kindahardgolf.com/", 
        cat: "Skill",
        desc: "A daily mini-golf challenge. Drag to aim and reach the flag in as few strokes as possible." 
    }
];

// --- 2. STATE MANAGEMENT ---
function getTodayKey() {
    const d = new Date();
    // "2024-01-20"
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function loadState() {
    const key = `daily_completed_${getTodayKey()}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveState(completedArray) {
    const key = `daily_completed_${getTodayKey()}`;
    localStorage.setItem(key, JSON.stringify(completedArray));
    render(); // Re-render to update UI
}

// --- 3. ICON FETCHING (Google Magic) ---
function getIconUrl(gameUrl) {
    // This Google service fetches the high-res favicon of any domain
    // sz=128 asks for a 128px image
    const domain = new URL(gameUrl).hostname;
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
}

// --- 4. RENDER LOGIC ---
const grid = document.getElementById('game-grid');

function render() {
    const completedGames = loadState();
    
    // Update Progress Bar
    const percent = (completedGames.length / games.length) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('stats-text').innerText = `${completedGames.length} / ${games.length} Completed`;

    grid.innerHTML = "";

    games.forEach((game) => {
        const isDone = completedGames.includes(game.name);
        
        // Build Card Element
        const card = document.createElement('div');
        card.className = `card ${isDone ? 'completed' : ''}`;
        
        // We use onclick to toggle expansion
        card.onclick = (e) => toggleExpand(e, card);

        card.innerHTML = `
            <div class="card-header">
                <img src="${getIconUrl(game.url)}" class="game-icon" alt="${game.name} icon">
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <div class="game-category">${game.cat}</div>
                </div>
                <div class="status-indicator" onclick="toggleComplete(event, '${game.name}')" title="Mark as Done">
                    ${isDone ? '✔' : '○'}
                </div>
            </div>

            <div class="card-details">
                <p class="game-summary">${game.desc}</p>
                <a href="${game.url}" target="_blank" class="play-btn" onclick="event.stopPropagation()">
                    Play Now ↗
                </a>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// --- 5. INTERACTION HANDLERS ---

// Toggle Card Expansion
function toggleExpand(event, cardElement) {
    // If we click the card header, toggle the class
    cardElement.classList.toggle('expanded');
}

// Toggle Completed Status
function toggleComplete(event, gameName) {
    event.stopPropagation(); // Don't trigger the card expansion
    
    let completed = loadState();
    
    if (completed.includes(gameName)) {
        completed = completed.filter(n => n !== gameName); // Remove
    } else {
        completed.push(gameName); // Add
    }
    
    saveState(completed);
}

// Random Button Logic
document.getElementById('random-btn').onclick = () => {
    const completed = loadState();
    const unplayed = games.filter(g => !completed.includes(g.name));
    
    if (unplayed.length === 0) {
        alert("All games completed for today!");
        return;
    }
    
    const randomGame = unplayed[Math.floor(Math.random() * unplayed.length)];
    window.open(randomGame.url, '_blank');
};

// Initial Load

render();
