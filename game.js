
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - 20 - PADDLE_WIDTH;
const PADDLE_COLOR = "#ffea00";
const BALL_COLOR = "#ffea00";
const NET_COLOR = "#444";
const SCORE_COLOR = "#fff";

let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    vx: Math.random() > 0.5 ? 4 : -4,
    vy: (Math.random() - 0.5) * 6,
    speed: 6
};

let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle to canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawNet() {
    for(let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 2, i, 4, 16, NET_COLOR);
    }
}

function drawScore() {
    ctx.fillStyle = SCORE_COLOR;
    ctx.font = "32px Arial";
    ctx.fillText(playerScore, canvas.width/4, 50);
    ctx.fillText(aiScore, canvas.width*3/4, 50);
}

// Game logic
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.vy = (Math.random() - 0.5) * 6;
    ball.speed = 6;
}

function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom wall collision
    if(ball.y <= 0) {
        ball.y = 0;
        ball.vy *= -1;
    }
    if(ball.y + BALL_SIZE >= canvas.height) {
        ball.y = canvas.height - BALL_SIZE;
        ball.vy *= -1;
    }

    // Paddle collision
    // Player paddle
    if (
        ball.x <= PLAYER_X + PADDLE_WIDTH &&
        ball.y + BALL_SIZE > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH;
        ball.vx *= -1;
        // Add some "spin" based on where it hits the paddle
        let hitPoint = (ball.y + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ball.vy = hitPoint * 0.18;
        ball.speed += 0.3;
    }

    // AI paddle
    if (
        ball.x + BALL_SIZE >= AI_X &&
        ball.y + BALL_SIZE > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - BALL_SIZE;
        ball.vx *= -1;
        // Add some "spin"
        let hitPoint = (ball.y + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ball.vy = hitPoint * 0.18;
        ball.speed += 0.3;
    }

    // Score
    if (ball.x + BALL_SIZE < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function updateAI() {
    // Simple AI follows the ball with some smoothing
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ball.y + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += 6;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= 6;
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawScore();

    // Draw paddles and ball
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
    drawBall(ball.x, ball.y, BALL_SIZE, BALL_COLOR);

    updateBall();
    updateAI();

    requestAnimationFrame(gameLoop);
}

gameLoop();
