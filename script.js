let size = 3; // Default grid size

let board = [];

let moves = 0;

let timer = 0;

let timerInterval = null;

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

}

function startTimer() {

    timerInterval = setInterval(() => {

        timer++;

        document.getElementById("timer").textContent = timer;

    }, 1000);

}

function changeDifficulty() {

    size = parseInt(document.getElementById("difficulty").value);

    resetGame();

}

// Leaderboard Functions

function saveScore(moves, time) {

    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];

    scores.push({ moves, time });

    scores.sort((a, b) => a.moves - b.moves || a.time - b.time);

    scores = scores.slice(0, 5); // Keep top 5 scores

    localStorage.setItem("leaderboard", JSON.stringify(scores));

    updateLeaderboard();

}

function updateLeaderboard() {

    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];

    let leaderboard = document.getElementById("leaderboard");

    leaderboard.innerHTML = "";

    scores.forEach(score => {

        let li = document.createElement("li");

        li.textContent = `${score.moves} moves - ${score.time} sec`;

        leaderboard.appendChild(li);

    });

}

// Initialize game

createBoard();

updateLeaderboard();
