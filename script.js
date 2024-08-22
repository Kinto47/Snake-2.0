import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

let scene, camera, renderer;
let snake = [], food;
let direction = 'RIGHT';
let score = 0;
let snakeLength = 5;

// Inizializza la scena
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Luce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Crea il serpente
    for (let i = 0; i < snakeLength; i++) {
        const segment = createCube(0x00ff00);
        segment.position.set(i * -1, 0, 0);
        snake.push(segment);
        scene.add(segment);
    }

    // Crea il cibo
    food = createCube(0xff0000);
    food.position.set(randomPosition(), 0, randomPosition());
    scene.add(food);

    // Event listener per i controlli
    document.addEventListener('keydown', onDocumentKeyDown);

    animate();
}

function createCube(color) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

function randomPosition() {
    return Math.floor(Math.random() * 10 - 5);
}

function onDocumentKeyDown(event) {
    const keyCode = event.which;
    if (keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function moveSnake() {
    let newHeadPosition = snake[0].position.clone();

    if (direction === 'LEFT') newHeadPosition.x -= 1;
    if (direction === 'UP') newHeadPosition.z -= 1;
    if (direction === 'RIGHT') newHeadPosition.x += 1;
    if (direction === 'DOWN') newHeadPosition.z += 1;

    // Verifica collisione con cibo
    if (newHeadPosition.distanceTo(food.position) < 0.5) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
        food.position.set(randomPosition(), 0, randomPosition());
        const newSegment = createCube(0x00ff00);
        snake.push(newSegment);
        scene.add(newSegment);
    } else {
        const tail = snake.pop();
        tail.position.copy(newHeadPosition);
        snake.unshift(tail);
    }
}

function animate() {
    requestAnimationFrame(animate);
    moveSnake();
    renderer.render(scene, camera);
}

init();
