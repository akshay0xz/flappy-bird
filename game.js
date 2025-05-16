window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    gravity: 0.6,
    lift: -12,
    velocity: 0
  };

  const pipes = [];
  const pipeWidth = 40;
  const pipeGap = 100;
  let frame = 0;
  let score = 0;
  let gameStarted = false;

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      if (!gameStarted) {
        resetGame();
        gameStarted = true;
      }
      bird.velocity = bird.lift;
    }
  });

  function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
  }

  function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
      let p = pipes[i];
      ctx.fillStyle = "green";
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, canvas.height - p.top - pipeGap);
    }
  }

  function updatePipes() {
    if (frame % 90 === 0) {
      let top = Math.random() * (canvas.height - pipeGap - 100) + 50;
      pipes.push({ x: canvas.width, top: top });
    }

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= 2;

      if (
        bird.x + bird.width / 2 > pipes[i].x &&
        bird.x - bird.width / 2 < pipes[i].x + pipeWidth &&
        (bird.y - bird.height / 2 < pipes[i].top ||
         bird.y + bird.height / 2 > pipes[i].top + pipeGap)
      ) {
        gameStarted = false;
      }

      if (pipes[i].x + pipeWidth < bird.x && !pipes[i].scored) {
        score++;
        pipes[i].scored = true;
      }
    }

    // Remove off-screen pipes
    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }
  }

  function drawText() {
    ctx.fillStyle = "white";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(score, 10, 30);

    if (!gameStarted) {
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("Flappy Bird", 90, 200);
      ctx.fillText("Press Space to Start", 60, 230);
    }
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted) {
      frame++;
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y + bird.height / 2 > canvas.height || bird.y - bird.height / 2 < 0) {
        gameStarted = false;
      }

      updatePipes();
    }

    drawBird();
    drawPipes();
    drawText();

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
};
