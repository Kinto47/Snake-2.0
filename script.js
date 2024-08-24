document.addEventListener("DOMContentLoaded", () => {
    let balance = 0;
    const username = "YourTelegramUsername";  // Questo dovrà essere ottenuto dal bot Telegram.
    const snakeGameCanvas = document.getElementById("snake-game");
    const ctx = snakeGameCanvas.getContext("2d");
    const balanceDisplay = document.getElementById("balance");
    const profileBalanceDisplay = document.getElementById("profile-balance");
    const profileUsernameDisplay = document.getElementById("profile-username");

    // Set username
    document.getElementById("username").textContent = username;
    profileUsernameDisplay.textContent = username;

    // Sections
    const playSection = document.getElementById("play-section");
    const tasksSection = document.getElementById("tasks-section");
    const profileSection = document.getElementById("profile-section");

    // Buttons
    document.getElementById("play-btn").addEventListener("click", () => {
        showSection(playSection);
        startGame();  // Start the game when PLAY section is shown
    });

    document.getElementById("tasks-btn").addEventListener("click", () => {
        showSection(tasksSection);
        stopGame();  // Stop the game when leaving PLAY section
    });

    document.getElementById("profile-btn").addEventListener("click", () => {
        showSection(profileSection);
        stopGame();  // Stop the game when leaving PLAY section
    });

    // Joystick controls
    let direction = "right";  // default direction
    document.getElementById("up").addEventListener("click", () => {
        if (direction !== "down") direction = "up";
    });

    document.getElementById("down").addEventListener("click", () => {
        if (direction !== "up") direction = "down";
    });

    document.getElementById("left").addEventListener("click", () => {
        if (direction !== "right") direction = "left";
    });

    document.getElementById("right").addEventListener("click", () => {
        if (direction !== "left") direction = "right";
    });

    // Tasks
    document.getElementById("join-group").addEventListener("click", () => {
        rewardToshi(300);
    });

    document.getElementById("join-channel").addEventListener("click", () => {
        rewardToshi(500);
    });

    // Function to display sections
    function showSection(section) {
        playSection.classList.add("hidden");
        tasksSection.classList.add("hidden");
        profileSection.classList.add("hidden");
        section.classList.remove("hidden");
    }

    // Function to update balance
    function rewardToshi(amount) {
        balance += amount;
        balanceDisplay.textContent = balance;
        profileBalanceDisplay.textContent = balance;
    }

    // Snake Game Logic
    const snakeSize = 10;
    let snake = [{x: 50, y: 50}];
    let food = {x: 100, y: 100};
    let gameInterval;

    function drawSnake() {
        ctx.clearRect(0, 0, snakeGameCanvas.width, snakeGameCanvas.height);
        ctx.fillStyle = "lime";
        snake.forEach(part => {
            ctx.fillRect(part.x, part.y, snakeSize, snakeSize);
        });
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    }

    function moveSnake() {
        let head = { ...snake[0] };
        if (direction === "up") head.y -= snakeSize;
        if (direction === "down") head.y += snakeSize;
        if (direction === "left") head.x -= snakeSize;
        if (direction === "right") head.x += snakeSize;

        // Check for collision with walls
        if (head.x < 0 || head.y < 0 || head.x >= snakeGameCanvas.width || head.y >= snakeGameCanvas.height) {
            clearInterval(gameInterval);
            alert("Game Over");
            resetGame();
            return;
        }

        // Check for collision with itself
        if (snake.some(part => part.x === head.x && part.y === head.y)) {
            clearInterval(gameInterval);
            alert("Game Over");
            resetGame();
            return;
        }

        snake.unshift(head);

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            rewardToshi(10);  // Add 10 TOSHI for each food eaten
            generateFood();
        } else {
            snake.pop();
        }

        drawSnake();
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * (snakeGameCanvas.width / snakeSize)) * snakeSize;
        food.y = Math.floor(Math.random() * (snakeGameCanvas.height / snakeSize)) * snakeSize;
    }

    function startGame() {
        resetGame();
        gameInterval = setInterval(moveSnake, 100);
    }

    function stopGame() {
        clearInterval(gameInterval);
    }

    function resetGame() {
        snake = [{x: 50, y: 50}];
        direction = "right";
        generateFood();
        drawSnake();
    }

    // Initialize with the PLAY section visible
    showSection(playSection);
});

window.Telegram.WebApp.ready(); 
