const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 500;
document.body.appendChild(canvas);

let bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;
let gameStarted = false;
let gameOver = false;

// Load bird image
const birdImage = new Image();
birdImage.src = "bird.png";

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
        } else if (!gameOver) {
            bird.velocity = bird.lift;
        } else {
            // Restart game
            bird.y = 150;
            bird.velocity = 0;
            pipes = [];
            frame = 0;
            score = 0;
            gameStarted = false;
            gameOver = false;
        }
    }
});

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(score, 10, 25);
}

function drawStartScreen() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Flappy Bird", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Press Space to Start", canvas.width / 2, canvas.height / 2 + 10);
}

function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 40);
}

function update() {
    if (!gameStarted) {
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawStartScreen();
        return;
    }

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (frame % 90 === 0) {
        let pipeHeight = Math.floor(Math.random() * 150) + 50;
        let gap = 100;
        pipes.push({
            x: canvas.width,
            width: 40,
            top: pipeHeight,
            bottom: canvas.height - pipeHeight - gap
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        // Collision detection
        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)
        ) {
            gameOver = true;
        }

        if (pipes[i].x + pipes[i].width === Math.floor(bird.x)) {
            score++;
        }
    }

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Check if bird hits ground or top
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function draw() {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBird();
    pipes.forEach(drawPipe);
    drawScore();

    if (gameOver) {
        drawGameOver();
    }
}

function loop() {
    update();
    draw();
    frame++;
    requestAnimationFrame(loop);
}

loop();
