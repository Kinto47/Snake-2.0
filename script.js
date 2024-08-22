import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

let scene, camera, renderer;
let snake = [], food;
let direction = 'RIGHT';
let score = 0;
let snakeLength = 5;

// Definizione dei limiti del campo di gioco
const fieldSize = 10; // Il campo di gioco sarà una griglia 20x20

// Inizializza la scena
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

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

    document.addEventListener('keydown', onDocumentKeyDown);
    animate();
}

// Funzione per creare un cubo
function createCube(color) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

// Genera una posizione casuale all'interno del campo di gioco
function randomPosition() {
    return Math.floor(Math.random() * fieldSize - fieldSize / 2);
}

// Gestione dell'input da tastiera
function onDocumentKeyDown(event) {
    const keyCode = event.which;
    if (keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

// Funzione per muovere il serpente con effetto Pac-Man
function moveSnake() {
    let newHeadPosition = snake[0].position.clone();

    if (direction === 'LEFT') newHeadPosition.x -= 1;
    if (direction === 'UP') newHeadPosition.z -= 1;
    if (direction === 'RIGHT') newHeadPosition.x += 1;
    if (direction === 'DOWN') newHeadPosition.z += 1;

    // Controllo dei confini in stile Pac-Man
    if (newHeadPosition.x < -fieldSize / 2) newHeadPosition.x = fieldSize / 2;
    if (newHeadPosition.x > fieldSize / 2) newHeadPosition.x = -fieldSize / 2;
    if (newHeadPosition.z < -fieldSize / 2) newHeadPosition.z = fieldSize / 2;
    if (newHeadPosition.z > fieldSize / 2) newHeadPosition.z = -fieldSize / 2;

    // Controlla la collisione con il cibo
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

// Funzione per animare la scena
function animate() {
    requestAnimationFrame(animate);
    moveSnake();
    renderer.render(scene, camera);
}

init();
