const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const gravity = 0.5;
const jumpForce = -8;
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpeed = 2;
const birdWidth = 40;
const birdHeight = 30;

let birdX = 50;
let birdY = 200;
let birdVelocity = 0;

let pipes = [];
let gameRunning = false;
let animationId;

// Load bird image
const birdImage = new Image();
birdImage.src = 'bird.png';

// DOM elements
const startScreen = document.getElementById('startScreen');
const gameOverDisplay = document.getElementById('gameOver');

// Draw the bird image
function drawBird(x, y) {
    ctx.drawImage(birdImage, x, y, birdWidth, birdHeight);
}

// Start the game
function startGame() {
    gameRunning = true;
    birdY = 200;
    birdVelocity = 0;
    pipes = [];
    gameOverDisplay.style.display = 'none';
    startScreen.style.display = 'none';
    animationId = requestAnimationFrame(updateGame);
}

// Game loop
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Draw bird
    drawBird(birdX, birdY);

    // Handle pipes
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        drawPipe(pipe);
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        generatePipe();
    }

    // Collision detection
    if (birdY + birdHeight > canvas.height || checkCollisions()) {
        gameOver();
        return;
    }

    animationId = requestAnimationFrame(updateGame);
}

// Draw pipe
function drawPipe(pipe) {
    ctx.fillStyle = '#228B22';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height);
}

// Generate pipe
function generatePipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight
    });
}

// Collision detection
function checkCollisions() {
    const birdRect = {
        left: birdX,
        top: birdY,
        right: birdX + birdWidth,
        bottom: birdY + birdHeight
    };

    return pipes.some(pipe => {
        const pipeRectTop = {
            left: pipe.x,
            top: 0,
            right: pipe.x + pipeWidth,
            bottom: pipe.topHeight
        };
        const pipeRectBottom = {
            left: pipe.x,
            top: pipe.topHeight + pipeGap,
            right: pipe.x + pipeWidth,
            bottom: canvas.height
        };

        return checkRectCollision(birdRect, pipeRectTop) || checkRectCollision(birdRect, pipeRectBottom);
    });
}

// Rectangle collision check
function checkRectCollision(rect1, rect2) {
    return (
        rect1.right > rect2.left &&
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

// Game over
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    gameOverDisplay.style.display = 'block';
}

// Jump
function jump() {
    if (!gameRunning && startScreen.style.display === 'none') {
        startGame();
    } else if (!gameRunning) {
        startGame();
    } else {
        birdVelocity = jumpForce;
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

document.addEventListener('touchstart', jump);

gameContainer.addEventListener('click', jump);
