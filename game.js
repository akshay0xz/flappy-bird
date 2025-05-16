document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const bird = document.getElementById('bird');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverDisplay = document.getElementById('game-over');
    const startScreen = document.getElementById('start-screen');
    
    // Game variables
    let birdPosition = 300;
    let birdVelocity = 0;
    let gravity = 0.5;
    let jumpForce = -10;
    let gameRunning = false;
    let score = 0;
    let pipes = [];
    let pipeGap = 200; // Increased gap between pipes
    let pipeFrequency = 1800; // milliseconds (slightly slower pipe generation)
    let lastPipeTime = 0;
    let animationId;
    
    // Start game
    function startGame() {
        // Reset variables
        birdPosition = gameContainer.offsetHeight / 2 - 15; // Start more centered
        birdVelocity = 0;
        score = 0;
        scoreDisplay.textContent = score;
        pipes.forEach(pipe => pipe.element.remove());
        pipes = [];
        
        // Hide start/game over screens
        gameOverDisplay.style.display = 'none';
        startScreen.style.display = 'none';
        
        // Reset bird position
        bird.style.top = birdPosition + 'px';
        
        // Start game loop
        gameRunning = true;
        lastPipeTime = Date.now();
        gameLoop();
    }
    
    // Game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        // Update bird
        birdVelocity += gravity;
        birdPosition += birdVelocity;
        bird.style.top = birdPosition + 'px';
        
        // Rotate bird based on velocity
        bird.style.transform = `rotate(${birdVelocity * 3}deg)`;
        
        // Generate pipes
        const currentTime = Date.now();
        if (currentTime - lastPipeTime > pipeFrequency) {
            createPipe();
            lastPipeTime = currentTime;
        }
        
        // Update pipes
        updatePipes();
        
        // Check collisions
        if (checkCollisions()) {
            gameOver();
            return;
        }
        
        // Continue loop
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Create a new pipe
    function createPipe() {
        const minPipeHeight = 80;
        const maxPipeHeight = gameContainer.offsetHeight - pipeGap - minPipeHeight;
        const pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight)) + minPipeHeight;
        
        const pipeTop = document.createElement('div');
        pipeTop.className = 'pipe';
        pipeTop.style.top = '0';
        pipeTop.style.height = pipeHeight + 'px';
        
        const pipeBottom = document.createElement('div');
        pipeBottom.className = 'pipe';
        pipeBottom.style.bottom = '0';
        pipeBottom.style.height = (gameContainer.offsetHeight - pipeHeight - pipeGap) + 'px';
        
        gameContainer.appendChild(pipeTop);
        gameContainer.appendChild(pipeBottom);
        
        pipes.push({
            element: pipeTop,
            passed: false,
            x: gameContainer.offsetWidth
        });
        
        pipes.push({
            element: pipeBottom,
            passed: false,
            x: gameContainer.offsetWidth
        });
    }
    
    // Update pipe positions
    function updatePipes() {
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            pipe.x -= 2;
            pipe.element.style.right = (gameContainer.offsetWidth - pipe.x) + 'px';
            
            // Check if bird passed the pipe
            if (!pipe.passed && pipe.x < 100) { // Adjusted passing point
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = score;
                
                // Increase difficulty more gradually
                if (score % 3 === 0) {
                    pipeFrequency = Math.max(1200, pipeFrequency - 50);
                }
            }
            
            // Remove pipes that are off screen
            if (pipe.x + 80 < 0) { // Adjusted for wider pipes
                pipe.element.remove();
                pipes.splice(i, 1);
                i--;
            }
        }
    }
    
    // Check for collisions
    function checkCollisions() {
        // Check if bird hits the ground or ceiling
        if (birdPosition >= gameContainer.offsetHeight - 30 || birdPosition <= 0) {
            return true;
        }
        
        // Check if bird hits a pipe
        const birdRect = {
            left: 100, // Adjusted for new bird position
            right: 100 + 40,
            top: birdPosition,
            bottom: birdPosition + 30
        };
        
        for (const pipe of pipes) {
            const pipeRect = {
                left: pipe.x,
                right: pipe.x + 80, // Wider pipes
                top: parseInt(pipe.element.style.top) || 0,
                bottom: parseInt(pipe.element.style.top) + parseInt(pipe.element.style.height) || 
                        gameContainer.offsetHeight - parseInt(pipe.element.style.bottom) - parseInt(pipe.element.style.height)
            };
            
            if (birdRect.right > pipeRect.left && 
                birdRect.left < pipeRect.right && 
                (birdRect.top < pipeRect.bottom || 
                 birdRect.bottom > (gameContainer.offsetHeight - pipeRect.bottom - pipeGap))) {
                return true;
            }
        }
        
        return false;
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
    
    gameContainer.addEventListener('click', jump);
});
