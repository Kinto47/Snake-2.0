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
let toshiBalance = parseInt(localStorage.getItem('toshiBalance')) || 0;
let communityJoined = localStorage.getItem('communityJoined') === 'true';
let speed = 200; // Velocità iniziale in millisecondi
let game;

// Aggiorna il punteggio e il bilancio di TOSHI
document.getElementById('score').innerText = `Score: ${score}`;
document.getElementById('toshi').innerText = `TOSHI: ${toshiBalance}`;

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

document.addEventListener('keydown', setDirection);

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

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        toshiBalance += 1; // Assegna 1 TOSHI per ogni punto
        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('toshi').innerText = `TOSHI: ${toshiBalance}`;
        localStorage.setItem('toshiBalance', toshiBalance);

        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };

        // Aumenta la velocità ogni 10 punti
        if (score % 10 === 0) {
            clearInterval(game);
            speed -= 20; // Riduce il tempo di intervallo, aumentando la velocità
            game = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= 20 * box || snakeY < 0 || snakeY >= 20 * box || collision(newHead, snake)) {
        clearInterval(game);
        alert('Game Over! Press OK to restart.');
        location.reload();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function updateJoinCommunityButton() {
    const joinCommunityBtn = document.getElementById('joinCommunityBtn');
    if (communityJoined) {
        joinCommunityBtn.disabled = true;
        joinCommunityBtn.innerText = 'You have already joined the community';
    } else {
        joinCommunityBtn.disabled = false;
        joinCommunityBtn.innerText = 'Join the Community and Earn 100 TOSHI';
    }
}

updateJoinCommunityButton();

document.getElementById('joinCommunityBtn').addEventListener('click', () => {
    if (!communityJoined && confirm('Do you want to join the community and earn 100 TOSHI?')) {
        window.open('https://t.me/thesatoshicircle', '_blank');
        toshiBalance += 100;
        localStorage.setItem('toshiBalance', toshiBalance);
        document.getElementById('toshi').innerText = `TOSHI: ${toshiBalance}`;
        communityJoined = true;
        localStorage.setItem('communityJoined', 'true');
        updateJoinCommunityButton();
        alert('You have earned 100 TOSHI!');
    }
});

// Gestione della navigazione tra le sezioni
const playBtn = document.getElementById('playBtn');
const taskBtn = document.getElementById('taskBtn');

playBtn.addEventListener('click', () => {
    document.getElementById('play-section').classList.add('active');
    document.getElementById('task-section').classList.remove('active');
    playBtn.classList.add('active');
    taskBtn.classList.remove('active');
});

taskBtn.addEventListener('click', () => {
    document.getElementById('play-section').classList.remove('active');
    document.getElementById('task-section').classList.add('active');
    taskBtn.classList.add('active');
    playBtn.classList.remove('active');
});

// Gestione del menu di avvio
document.getElementById('startGameBtn').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none'; // Nasconde il menu
    document.getElementById('hud').style.display = 'flex'; // Mostra l'HUD
    canvas.style.display = 'block'; // Mostra il canvas di gioco
    game = setInterval(draw, speed); // Avvia il gioco
});
