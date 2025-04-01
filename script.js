let size = 3; 

let board = [];

let moves = 0;

let timer = 0;

let timerInterval = null;

let hintCount = 0;
const maxHints = 3;

function createBoard() {

    const gameBoard = document.getElementById("game-board");

    gameBoard.innerHTML = "";

    gameBoard.style.gridTemplateColumns = `repeat(${size}, 60px)`;

    board = [];

    moves = 0;

    timer = 0;

    document.getElementById("move-counter").textContent = moves;

    document.getElementById("timer").textContent = timer;

    if (timerInterval) clearInterval(timerInterval);

    startTimer();

    for (let i = 0; i < size; i++) {

        board[i] = [];

        for (let j = 0; j < size; j++) {

            let button = document.createElement("button");

            button.classList.add("off");

            button.dataset.row = i;

            button.dataset.col = j;

            button.addEventListener("click", toggleSwitch);

            gameBoard.appendChild(button);

            board[i][j] = button;

        }

    }

}

function getHint(clickCount) {
    let hint = "";
    const allSwitches = Array.from(document.querySelectorAll('#game-board button'));
    const onSwitches = allSwitches.filter(btn => btn.classList.contains('on')).length;
    
    if (size === 3) {
        switch(clickCount) {
            case 1:
                hint = "💡 Start with corners: Try clicking any corner switch first. Notice how it affects adjacent switches.";
                break;
            case 2:
                hint = `💡 Progress: ${onSwitches} switches are green. Try to create a pattern - sometimes making some switches gray temporarily is necessary!`;
                break;
            case 3:
                hint = "💡 Strategy: The center switch affects all four adjacent switches, while corner switches only affect two neighbors. Use this to your advantage!";
                break;
        }
    } else if (size === 4) {
        switch(clickCount) {
            case 1:
                hint = "💡 4x4 Strategy: Start by focusing on the outer edges. The corners are good starting points!";
                break;
            case 2:
                hint = `💡 Current Status: ${onSwitches} green lights! Remember that symmetrical patterns often lead to success. Try working in pairs of switches.`;
                break;
            case 3:
                hint = "💡 Advanced Tip: Sometimes you need to create temporary patterns. Don't worry if some switches turn gray - it might be part of the solution!";
                break;
        }
    } else if (size === 5) {
        switch(clickCount) {
            case 1:
                hint = "💡 5x5 Tips: The center switch is crucial! It affects four adjacent switches and can be key to solving the puzzle.";
                break;
            case 2:
                hint = `💡 Building Progress: ${onSwitches} switches are green. Try creating a cross or X pattern - these patterns often help in larger grids!`;
                break;
            case 3:
                hint = "💡 Master Strategy: Think of the grid in sections - solve one area at a time. The corners and edges can be used to fix the middle section.";
                break;
        }
    }
    return hint;
}

function toggleSwitch(event) {

    let row = parseInt(event.target.dataset.row);

    let col = parseInt(event.target.dataset.col);

    document.getElementById("click-sound").play();

    function flip(r, c) {

        if (r >= 0 && r < size && c >= 0 && c < size) {

            board[r][c].classList.toggle("on");

            board[r][c].classList.toggle("off");

        }

    }

    flip(row, col);

    flip(row - 1, col);

    flip(row + 1, col);

    flip(row, col - 1);

    flip(row, col + 1);

    moves++;

    document.getElementById("move-counter").textContent = moves;

    if (moves <= maxHints) {
        const hint = getHint(moves);
        showHint(hint);
    }

    checkWin();

}

function checkWin() {

    let allOn = board.every(row => row.every(btn => btn.classList.contains("on")));

    if (allOn) {

        document.getElementById("message").textContent = "You Win!";

        clearInterval(timerInterval);

        document.getElementById("win-sound").play();

        saveScore(moves, timer);

    }

}

function resetGame() {
    createBoard();
    document.getElementById("message").textContent = "";
    document.getElementById("hint-container").innerHTML = "";
    moves = 0;
    updateLeaderboard();
}

function startTimer() {

    timerInterval = setInterval(() => {

        timer++;

        document.getElementById("timer").textContent = timer;

    }, 1000);

}

function changeDifficulty() {

    size = parseInt(document.getElementById("difficulty").value);

    document.getElementById("hint-text").textContent = "";

    resetGame();

    updateLeaderboard();

}

function saveScore(moves, time) {
    let playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        playerName = "Anonymous";
    }

    const difficultyKey = `leaderboard_${size}x${size}`;
    let scores = JSON.parse(sessionStorage.getItem(difficultyKey)) || [];
    scores.push({ name: playerName, moves, time });
    scores.sort((a, b) => a.moves - b.moves || a.time - b.time);
    scores = scores.slice(0, 5);
    sessionStorage.setItem(difficultyKey, JSON.stringify(scores));
    updateLeaderboard();
}

function updateLeaderboard() {
    const difficultyKey = `leaderboard_${size}x${size}`;
    let scores = JSON.parse(sessionStorage.getItem(difficultyKey)) || [];
    let leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = `<h3>${size}x${size} Leaderboard</h3>`;

    if (scores.length === 0) {
        leaderboard.innerHTML += "<p>No scores yet for this difficulty!</p>";
        return;
    }

    scores.forEach((score, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span class="score-name">${index + 1}. ${score.name}</span>
            <span>${score.moves} moves - ${score.time} sec</span>
        `;
        leaderboard.appendChild(li);
    });
}

function showHint(hint) {
    const hintContainer = document.getElementById("hint-container");
    const currentHint = document.createElement("div");
    currentHint.className = "hint-message";
    currentHint.innerHTML = hint;

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.className = "hint-close";
    closeBtn.onclick = function() {
        currentHint.remove();
    };
    currentHint.appendChild(closeBtn);

    hintContainer.insertBefore(currentHint, hintContainer.firstChild);

    const hints = hintContainer.getElementsByClassName("hint-message");
    if (hints.length > 3) {
        hintContainer.removeChild(hintContainer.lastChild);
    }
}

createBoard();

updateLeaderboard();
