const game = document.getElementById("game");
const basket = document.getElementById("basket");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const finalScore = document.getElementById("final-score");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over");

const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

let score = 0;
let lives = 3;
let basketX = 50;

let gameRunning = false;
let gameSpeed = 3;
let spawnRate = 900;

let starInterval;
let animationFrame;

/* -------------------------
   Start Game
------------------------- */

function startGame() {
    score = 0;
    lives = 3;
    gameSpeed = 3;
    spawnRate = 900;
    basketX = 50;

    scoreElement.textContent = score;
    livesElement.textContent = lives;

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    basket.style.left = basketX + "%";

    gameRunning = true;

    clearStars();

    startSpawning();
    gameLoop();
}

/* -------------------------
   Spawn Stars
------------------------- */

function startSpawning() {
    clearInterval(starInterval);

    starInterval = setInterval(() => {
        if (gameRunning) {
            createStar();
        }
    }, spawnRate);
}

function createStar() {
    const star = document.createElement("div");

    star.classList.add("star");
    star.textContent = "⭐";

    const maxX = game.clientWidth - 40;
    const randomX = Math.random() * maxX;

    star.style.left = randomX + "px";
    star.style.top = "-40px";

    game.appendChild(star);
}

/* -------------------------
   Game Loop
------------------------- */

function gameLoop() {
    if (!gameRunning) return;

    const stars = document.querySelectorAll(".star");

    stars.forEach(star => {
        let top = parseFloat(star.style.top);

        top += gameSpeed;
        star.style.top = top + "px";

        checkCollision(star, top);
    });

    animationFrame = requestAnimationFrame(gameLoop);
}

/* -------------------------
   Collision Detection
------------------------- */

function checkCollision(star, top) {
    const starRect = star.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    if (
        starRect.bottom >= basketRect.top &&
        starRect.left < basketRect.right &&
        starRect.right > basketRect.left
    ) {
        score++;

        scoreElement.textContent = score;

        star.remove();

        increaseDifficulty();
    }

    else if (top > game.clientHeight) {
        star.remove();

        lives--;

        livesElement.textContent = lives;

        if (lives <= 0) {
            endGame();
        }
    }
}

/* -------------------------
   Difficulty
------------------------- */

function increaseDifficulty() {
    if (score % 5 === 0) {
        gameSpeed += 0.5;

        if (spawnRate > 350) {
            spawnRate -= 50;
            startSpawning();
        }
    }
}

/* -------------------------
   Movement
------------------------- */

document.addEventListener("keydown", event => {
    if (!gameRunning) return;

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        moveBasket(-5);
    }

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        moveBasket(5);
    }
});

function moveBasket(amount) {
    basketX += amount;

    if (basketX < 5) {
        basketX = 5;
    }

    if (basketX > 95) {
        basketX = 95;
    }

    basket.style.left = basketX + "%";
}

/* -------------------------
   End Game
------------------------- */

function endGame() {
    gameRunning = false;

    clearInterval(starInterval);
    cancelAnimationFrame(animationFrame);

    finalScore.textContent = score;

    gameOverScreen.classList.remove("hidden");
}

/* -------------------------
   Remove Stars
------------------------- */

function clearStars() {
    document.querySelectorAll(".star").forEach(star => {
        star.remove();
    });
}

/* -------------------------
   Buttons
------------------------- */

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
