const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let snake;
let coin;
let cursors;
let score = 0;
let speed = 100;
let username = "Username"; // Questo dovrebbe essere popolato dinamicamente
let toshi = 0;
let direction = 'right';
let joystick;
let lastMoveTime = 0;
let moveInterval = 200;

function preload() {
    this.load.image('satoshi', 'satoshi.png');
    this.load.image('coin', 'bitcoin.png');
}

function create() {
    snake = this.physics.add.group();
    let startX = Phaser.Math.Between(10, 600);
    let startY = Phaser.Math.Between(10, 400);
    snake.create(startX, startY, 'satoshi');

    coin = this.physics.add.image(Phaser.Math.Between(10, 790), Phaser.Math.Between(10, 590), 'coin');

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(snake, coin, collectCoin, null, this);

    // Creazione del joystick virtuale
    joystick = new VirtualJoystick.VirtualJoystick({
        container: document.getElementById('joystick-container'),
        mouseSupport: true,
        stationaryBase: true,
        baseX: 100,
        baseY: 100,
        limitStickTravel: true,
        stickRadius: 50
    });

    joystick.addEventListener('touchMove', function(event) {
        if (Math.abs(event.x) > Math.abs(event.y)) {
            direction = event.x > 0 ? 'right' : 'left';
        } else {
            direction = event.y > 0 ? 'down' : 'up';
        }
    });
}

function update(time) {
    if (time >= lastMoveTime + moveInterval) {
        let snakeHead = snake.getChildren()[0];

        switch(direction) {
            case 'left':
                snakeHead.x -= 10;
                break;
            case 'right':
                snakeHead.x += 10;
                break;
            case 'up':
                snakeHead.y -= 10;
                break;
            case 'down':
                snakeHead.y += 10;
                break;
        }

        lastMoveTime = time;

        // Controllo per uscita dai limiti dello schermo
        if (snakeHead.x < 0 || snakeHead.x > 800 || snakeHead.y < 0 || snakeHead.y > 600) {
            gameOver();
        }
    }
}

function collectCoin() {
    score += 1;
    coin.x = Phaser.Math.Between(10, 790);
    coin.y = Phaser.Math.Between(10, 590);

    // Aumenta la velocità ogni 3 monete raccolte
    if (score % 3 === 0) {
        speed += 10;
        moveInterval = 200 - speed;
    }

    document.getElementById('score').innerText = `Score: ${score}`;
    toshi += 10;
    document.getElementById('toshi-count').innerText = `TOSHI: ${toshi}`;
}

function gameOver() {
    alert('Game Over! Your score is ' + score);
    saveUserData();
    resetGame();
}

function resetGame() {
    score = 0;
    speed = 100;
    moveInterval = 200;
    snake.clear(true, true);
    let startX = Phaser.Math.Between(10, 600);
    let startY = Phaser.Math.Between(10, 400);
    snake.create(startX, startY, 'satoshi');
    document.getElementById('score').innerText = `Score: 0`;
}

function startGame() {
    document.getElementById('menu').classList.remove('visible');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('game').classList.add('visible');
}

function showTasks() {
    document.getElementById('menu').classList.remove('visible');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('tasks').classList.remove('hidden');
    document.getElementById('tasks').classList.add('visible');
}

function showFrens() {
    document.getElementById('menu').classList.remove('visible');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('frens').classList.remove('hidden');
    document.getElementById('frens').classList.add('visible');
}

function generateRefLink() {
    let refLink = `https://example.com/ref?user=${username}`;
    document.getElementById('referral-link').innerText = `Your referral link: ${refLink}`;
}

function joinGroup() {
    alert("Joined the group!");
    toshi += 100;
    document.getElementById('toshi-count').innerText = `TOSHI: ${toshi}`;
}

function subscribeChannel() {
    alert("Subscribed to the channel!");
    toshi += 200;
    document.getElementById('toshi-count').innerText = `TOSHI: ${toshi}`;
}

function saveUserData() {
    fetch('/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            toshi: toshi
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Punteggio salvato con successo!");
        } else {
            alert("Errore durante il salvataggio del punteggio.");
        }
    });
}

window.addEventListener('beforeunload', saveUserData);

// Event Listeners per i bottoni
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('tasks-button').addEventListener('click', showTasks);
    document.getElementById('frens-button').addEventListener('click', showFrens);
});
