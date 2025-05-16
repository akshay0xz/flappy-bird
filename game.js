window.onload = function () {
  const startBtn = document.getElementById('startBtn');
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Bird properties
  const bird = {
    x: 150,
    y: 0, // set in resetGame()
    radius: 20,
    gravity: 0.4,
    center: -10,
    velocity: 0
  };

  const pipes = [ ];
  const pipeWidth = 69;
  let pipeGap = 350;  // wide gap
  let pipeSpeed = 2;
  let frame = 0;
  let score = 0;
  let gameStarted = false;

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPipes() {
    ctx.fillStyle = "green";
    for (let p of pipes) {
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, canvas.height - (p.top + pipeGap));
    }
  }

  function updatePipes() {
    if (frame % 90 === 0) {
      const maxPipeTop = canvas.height - pipeGap - 100;
      const top = Math.random() * maxPipeTop + 50;
      pipes.push({ x: canvas.width + 50, top: top, scored: false }); // pipes start a little outside screen
    }

    for (let i = 0; i < pipes.length; i++) {
      const p = pipes[i];
      p.x -= pipeSpeed;

      // Collision detection
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + pipeWidth &&
        (bird.y - bird.radius < p.top || bird.y + bird.radius > p.top + pipeGap)
      ) {
        gameStarted = false;
      }

      // Score update
      if (p.x + pipeWidth < bird.x && !p.scored) {
        score++;
        p.scored = true;

        // Difficulty increase every 5 points
        if (score % 5 === 0) {
          pipeSpeed += 0.3;
          if (pipeGap > 250) pipeGap -= 10;
        }
      }
    }

    // Remove pipes off screen
    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }
  }

  function drawText() {
    ctx.fillStyle = "white";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Score: " + score, 30, 50);

    if (!gameStarted) {
      ctx.font = "bold 48px sans-serif";
      ctx.fillText("Game Over", canvas.width / 2 - 130, canvas.height / 2 - 20);

      ctx.font = "28px sans-serif";
      ctx.fillText("Press Space to Restart", canvas.width / 2 - 160, canvas.height / 2 + 40);
    }
  }

  function resetGame() {
    bird.y = canvas.height / 2;  // center vertically
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    pipeSpeed = 2;
    pipeGap = 350;
    gameStarted = true;
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted) {
      frame++;
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      // Keep bird inside canvas vertically
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

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      if (gameStarted) {
        bird.velocity = bird.lift;
      } else {
        resetGame();
      }
    }
  });

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
