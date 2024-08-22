document.addEventListener('DOMContentLoaded', () => {
    const gameBtn = document.getElementById('game-btn');
    const taskBtn = document.getElementById('task-btn');
    const gameSection = document.getElementById('game-section');
    const taskSection = document.getElementById('task-section');
    const menu = document.querySelector('.menu');
    const startBtn = document.getElementById('start-btn');
    const scoreEl = document.getElementById('score');
    const toshiEl = document.getElementById('toshi');

    let score = 0;
    let toshi = 0;

    // Funzioni per il cambio di sezione
    gameBtn.addEventListener('click', () => {
        menu.classList.add('hidden');
        taskSection.classList.add('hidden');
        gameSection.classList.remove('hidden');
    });

    taskBtn.addEventListener('click', () => {
        menu.classList.add('hidden');
        gameSection.classList.add('hidden');
        taskSection.classList.remove('hidden');
    });

    // Funzione per iniziare il gioco
    startBtn.addEventListener('click', () => {
        startGame();
    });

    // Funzione per gestire il gioco
    function startGame() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        let snake = [{ x: 10, y: 10 }];
        let direction = { x: 0, y: 0 };
        let speed = 200;
        let food = { x: 15, y: 15 };

        function gameLoop() {
            // Update Snake position
            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
            snake.unshift(head);

            // Check if snake eats food
            if (head.x === food.x && head.y === food.y) {
                score++;
                toshi += 10;
                toshiEl.textContent = `TOSHI: ${toshi}`;
                scoreEl.textContent = score;
                if (score % 3 === 0) {
                    speed = Math.max(50, speed - 20);
                }
                generateFood();
            } else {
                snake.pop();
            }

            // Check for collisions
            if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 || snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
                alert("Game Over! Final Score: " + score);
                resetGame();
                return;
            }

            renderGame();
            setTimeout(gameLoop, speed);
        }

        function generateFood() {
            food.x = Math.floor(Math.random() * 20);
            food.y = Math.floor(Math.random() * 20);
        }

        function resetGame() {
            snake = [{ x: 10, y: 10 }];
            direction = { x: 0, y: 0 };
            speed = 200;
            score = 0;
            scoreEl.textContent = score;
        }

        function renderGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Snake
            ctx.fillStyle = 'orange';
            snake.forEach(segment => {
                ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
            });

            // Draw Food
            ctx.fillStyle = 'green';
            ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
        }

        function controlSnake(e) {
            switch (e.key) {
                case "ArrowUp":
                    if (direction.y === 0) direction = { x: 0, y: -1 };
                    break;
                case "ArrowDown":
                    if (direction.y === 0) direction = { x: 0, y: 1 };
                    break;
                case "ArrowLeft":
                    if (direction.x === 0) direction = { x: -1, y: 0 };
                    break;
                case "ArrowRight":
                    if (direction.x === 0) direction = { x: 1, y: 0 };
                    break;
            }
        }

        document.addEventListener('keydown', controlSnake);
        generateFood();
        gameLoop();
    }
});
