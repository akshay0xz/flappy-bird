window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

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
  const pipeGap = 180;
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
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
  }

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
      let top = Math.random() * (canvas.height - pipeGap - 200) + 50;
      pipes.push({ x: canvas.width, top: top });
    }

    for (let i = 0; i < pipes.length; i++) {
      let p = pipes[i];
      p.x -= 3;

      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + pipeWidth &&
        (bird.y - bird.radius < p.top ||
         bird.y + bird.radius > p.top + pipeGap)
      ) {
        gameStarted = false;
      }

      if (p.x + pipeWidth < bird.x && !p.scored) {
        score++;
        p.scored = true;
      }
    }

    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }
  }

  function drawText() {
    ctx.fillStyle = "white";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(score, 30, 50);

    if (!gameStarted) {
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("Flappy Bird", canvas.width / 2 - 100, canvas.height / 2 - 20);
      ctx.font = "24px sans-serif";
      ctx.fillText("Press Space to Start", canvas.width / 2 - 120, canvas.height / 2 + 20);
    }
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted) {
      frame++;
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

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

  gameLoop();
};
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
const canvas = document.getElementById('gameCanvas');
canvas.addEventListener('click', () => {
  toggleFullScreen();
});
