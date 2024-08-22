const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Dimensione di ogni segmento del serpente e del cibo
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction;
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;

// Controlla la direzione del serpente in base ai tasti premuti
document.addEventListener('keydown', setDirection);

function setDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (key === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (key === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (key === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

// Funzione per disegnare il serpente e il cibo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#00ff00' : '#ffffff';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Posizione della testa del serpente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Aggiorna la posizione del serpente in base alla direzione
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Se il serpente mangia il cibo
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Rimuove l'ultimo segmento del serpente
    }

    // Aggiunge una nuova testa alla posizione calcolata
    const newHead = { x: snakeX, y: snakeY };

    // Controlla le collisioni con il serpente stesso o con i bordi del campo di gioco
    if (snakeX < 0 || snakeX >= 20 * box || snakeY < 0 || snakeY >= 20 * box || collision(newHead, snake)) {
        clearInterval(game);
        alert('Game Over! Press OK to restart.');
        location.reload();
    }

    snake.unshift(newHead);
}

// Funzione per controllare se il serpente collide con se stesso
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Imposta l'intervallo per il ciclo di gioco
const game = setInterval(draw, 100);
