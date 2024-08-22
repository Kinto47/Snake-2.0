const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Dimensione di ogni segmento del serpente e del cibo
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let directionX = 0;  // Direzione X del movimento
let directionY = 0;  // Direzione Y del movimento
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let toshiBalance = parseInt(localStorage.getItem('toshiBalance')) || 0;
let communityJoined = localStorage.getItem('communityJoined') === 'true';
let speed = 200; // Velocità iniziale in millisecondi
let game;

document.getElementById('score').innerText = `Score: ${score}`;
document.getElementById('toshi').innerText = `TOSHI: ${toshiBalance}`;

// Joystick setup
const joystick = document.getElementById('joystick');
const stick = document.querySelector('#joystick .stick');
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };

joystick.addEventListener('touchstart', function(event) {
    joystickActive = true;
    const touch = event.touches[0];
    joystickCenter = { x: touch.clientX, y: touch.clientY };
}, false);

joystick.addEventListener('touchmove', function(event) {
    if (!joystickActive) return;
    const touch = event.touches[0];
    const offsetX = touch.clientX - joystickCenter.x;
    const offsetY = touch.clientY - joystickCenter.y;
    stick.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // Normalizza il movimento per ottenere direzione
    const magnitude = Math.sqrt(offsetX ** 2 + offsetY ** 2);
    directionX = offsetX / magnitude;
    directionY = offsetY / magnitude;
}, false);

joystick.addEventListener('touchend', function() {
    joystickActive = false;
    stick.style.transform = 'translate(0, 0)';
    directionX = 0;
    directionY = 0;
}, false);

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

    let snakeX = snake[0].x + directionX * box;
    let snakeY = snake[0].y + directionY * box;

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
const menu = document.getElementById('menu');
const hud = document.getElementById('hud');
const playSection = document.getElementById('play-section');
const taskSection = document.getElementById('task-section');
const gameCanvas = document.getElementById('gameCanvas');
const bottomNav = document.querySelector('.bottom-nav');

playBtn.addEventListener('click', () => {
    menu.style.display = 'none'; // Nasconde il menu se si passa al gioco
    taskSection.classList.remove('active');
    playSection.classList.add('active');
    taskBtn.classList.remove('active');
    playBtn.classList.add('active');
    hud.style.display = 'flex'; // Mostra l'HUD
    gameCanvas.style.display = 'block'; // Mostra il canvas di gioco
    joystick.style.display = 'block'; // Mostra il joystick
});

taskBtn.addEventListener('click', () => {
    menu.style.display = 'none'; // Nasconde il menu se si passa alla task
    playSection.classList.remove('active');
    taskSection.classList.add('active');
    playBtn.classList.remove('active');
    taskBtn.classList.add('active');
    hud.style.display = 'none'; // Nasconde l'HUD
    gameCanvas.style.display = 'none'; // Nasconde il canvas di gioco
    joystick.style.display = 'none'; // Nasconde il joystick
    bottomNav.style.display = 'flex'; // Mostra la navigazione in basso
});

// Gestione del menu di avvio
document.getElementById('startGameBtn').addEventListener('click', () => {
    menu.style.display = 'none'; // Nasconde il menu
    hud.style.display = 'flex'; // Mostra l'HUD
    gameCanvas.style.display = 'block'; // Mostra il canvas di gioco
    joystick.style.display = 'block'; // Mostra il joystick
    bottomNav.style.display = 'flex'; // Mostra la navigazione in basso
    game = setInterval(draw, speed); // Avvia il gioco
});
