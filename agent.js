// This file combines both the neural network and the game
// Dimension of the snake game, needs to be changed in stylesheet too
const dimension = 8;
const frameInterval = 200;
// Score is incremented by 10 when the snake gets an apple.
let score = 0;
let numFrames = 0;
let reward = 0;


function runGame() {
    clearScreen();
    if (newApple) {
        setAppleLocation();
    }
    newApple = checkAppleCollision();
    // getInput(eventDirection);
    getAiInput(eventDirection);
    moveSnake();
    drawApple();
    
    // 100 * snake length is how long the snake has to beat the game.
    if(checkWallCollision(snake[0]) || numFrames > 100 * snake.length) {
        numFrames = 0;
        failScreen();
    } else if (checkWin()) {
        winScreen();
    } else {
        drawSnake();
        numFrames++;
        score += reward;
        reward = 0;
        setTimeout(runGame, frameInterval);
    }

}

initializeBoxes(dimension);
runGame();