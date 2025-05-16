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
    y: 0,         // will set later in reset
    radius: 20,
    gravity: 0.6,
    lift: -12,
    velocity: 0
  };

  const pipes = [];
  const pipeWidth = 60;
  let pipeGap = 220;  // bigger gap for easier start
  let pipeSpeed = 3;  
  let frame = 0;
  let score = 0;
  let gameStarted = false;

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

  // Update pipes position and add new pipes
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
          pipeSpeed += 0.5;
          if (pipeGap > 140) {  // don't reduce below 140
            pipeGap -= 10;
          }
        }
      }
    }

    // Remove off-screen pipes
    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }
  }

  // Draw score and messages
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

  // Reset game variables and center bird vertically
  function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    pipeSpeed = 3;
    pipeGap = 220;
    gameStarted = true;
  }

  // Game loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted) {
      frame++;
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      // Check if bird hits top or bottom
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

  // Key press for flap or restart
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      if (gameStarted) {
        bird.velocity = bird.lift;
      } else {
        resetGame();
      }
    }
  });

  // Start button: fullscreen + start game
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
