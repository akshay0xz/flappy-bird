window.onload = function () {
  const startBtn = document.getElementById('startBtn');
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Game variables
  const bird = {
    x: 100,
    y: 150,
    radius: 20,
    gravity: 0.6,
    lift: -12,
    velocity: 0
  };

  const pipes = [];
  const pipeWidth = 60;
  let pipeGap = 180;  // We'll reduce this to increase difficulty
  let pipeSpeed = 3;  // We'll increase this to make game harder
  let frame = 0;
  let score = 0;
  let gameStarted = false;

  // Resize canvas initially
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Draw bird as yellow circle
  function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw pipes
  function drawPipes() {
    ctx.fillStyle = "green";
    for (let p of pipes) {
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, canvas.height - (p.top + pipeGap));
    }
  }

  // Update pipe positions and add new pipes
  function updatePipes() {
    if (frame % 90 === 0) {
      let top = Math.random() * (canvas.height - pipeGap - 200) + 50;
      pipes.push({ x: canvas.width, top: top, scored: false });
    }

    for (let i = 0; i < pipes.length; i++) {
      let p = pipes[i];
      p.x -= pipeSpeed;

      // Collision detection
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + pipeWidth &&
        (bird.y - bird.radius < p.top || bird.y + bird.radius > p.top + pipeGap)
      ) {
        gameStarted = false;
      }

      // Scoring
      if (p.x + pipeWidth < bird.x && !p.scored) {
        score++;
        p.scored = true;

        // Increase difficulty every 5 points
        if (score % 5 === 0) {
          pipeSpeed += 0.5;    // Increase pipe speed
          if (pipeGap > 100) { // Decrease gap but keep minimum size
            pipeGap -= 10;
          }
        }
      }
    }

    // Remove pipes off screen
    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }
  }

  // Draw score and game over messages
  function drawText() {
    ctx.fillStyle = "white";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Score: " + score, 30, 50);

    if (!gameStarted) {
      ctx.font = "bold 48px sans-serif";
      ctx.fillText("Game Over", canvas.width / 2 - 130, canvas.height / 2 - 20);

      ctx.font = "28px sans-serif";
      ctx.fillText("Press Space to Restart", canvas.width / 2 - 150, canvas.height / 2 + 40);
    }
  }

  // Game reset
  function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    pipeSpeed = 3;
    pipeGap = 180;
    gameStarted = true;
  }

  // Main game loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted) {
      frame++;
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      // Prevent bird going out of canvas vertically
      if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameStarted = false;
      }

      updatePipes();
    }

    drawBird();
    drawPipes();
    drawText();

    requestAnimationFrame(gameLoop);
  }

  // Keydown event for flapping and restarting
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      if (gameStarted) {
        bird.velocity = bird.lift;
      } else {
        resetGame();
      }
    }
  });

  // Start button event: fullscreen and game start
  startBtn.onclick = async () => {
    startBtn.style.display = 'none';
    canvas.style.display = 'block';
    resizeCanvas();

    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      alert('Fullscreen request failed: ' + err.message);
    }

    resetGame();
    gameLoop();
  };
};
