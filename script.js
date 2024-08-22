document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    const tasksButton = document.getElementById('tasks-button');
    const frensButton = document.getElementById('frens-button');
    const joinGroupButton = document.getElementById('join-group-button');
    const subscribeChannelButton = document.getElementById('subscribe-channel-button');
    const generateRefLinkButton = document.getElementById('generate-ref-link-button');

    let toshi = 0;

    startButton.addEventListener('click', function() {
        showSection('game');
        startGame();
    });

    tasksButton.addEventListener('click', function() {
        showSection('tasks');
    });

    frensButton.addEventListener('click', function() {
        showSection('frens');
    });

    joinGroupButton.addEventListener('click', function() {
        addToshi(100);
        alert("You have joined the group and earned 100 TOSHI!");
    });

    subscribeChannelButton.addEventListener('click', function() {
        addToshi(200);
        alert("You have subscribed to the channel and earned 200 TOSHI!");
    });

    generateRefLinkButton.addEventListener('click', function() {
        generateRefLink();
    });

    function showSection(sectionId) {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('visible');
        });

        document.getElementById(sectionId).classList.remove('hidden');
        document.getElementById(sectionId).classList.add('visible');
    }

    function addToshi(amount) {
        toshi += amount;
        document.getElementById('toshi-count').innerText = `TOSHI: ${toshi}`;
    }

    function generateRefLink() {
        const username = "Username"; // Questo dovrebbe essere dinamico
        const refLink = `https://example.com/ref?user=${username}`;
        document.getElementById('referral-link').innerText = `Your referral link: ${refLink}`;
        addToshi(200);
    }

    function startGame() {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            backgroundColor: '#ffffff',
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
        let direction = 'right';
        let speed = 200;
        let lastMoveTime = 0;

        function preload() {
            this.load.image('satoshi', 'satoshi.png');
            this.load.image('coin', 'bitcoin.png');
        }

        function create() {
            snake = this.physics.add.group();
            let startX = Phaser.Math.Between(100, 700);
            let startY = Phaser.Math.Between(100, 500);
            snake.create(startX, startY, 'satoshi');

            coin = this.physics.add.image(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), 'coin');
            cursors = this.input.keyboard.createCursorKeys();
        }

        function update(time) {
            if (time >= lastMoveTime + speed) {
                let snakeHead = snake.getChildren()[0];

                switch (direction) {
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

                if (Phaser.Geom.Intersects.RectangleToRectangle(snakeHead.getBounds(), coin.getBounds())) {
                    collectCoin();
                }

                if (snakeHead.x < 0 || snakeHead.x > 800 || snakeHead.y < 0 || snakeHead.y > 600) {
                    gameOver();
                }
            }

            if (cursors.left.isDown) {
                direction = 'left';
            } else if (cursors.right.isDown) {
                direction = 'right';
            } else if (cursors.up.isDown) {
                direction = 'up';
            } else if (cursors.down.isDown) {
                direction = 'down';
            }
        }

        function collectCoin() {
            score += 10;
            document.getElementById('score').innerText = `Score: ${score}`;
            coin.setPosition(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550));
            addToshi(10);
        }

        function gameOver() {
            alert(`Game Over! Your final score is ${score}.`);
            game.destroy(true);
            showSection('menu');
        }
    }
});
