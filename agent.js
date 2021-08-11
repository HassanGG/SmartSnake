// This file combines both the neural network and the game
// Dimension of the snake game, needs to be changed in stylesheet too
const dimension = 8;
const frameInterval = 200;
// Score is incremented by 10 when the snake gets an apple.
let score = 0;


function runGame() {
    clearScreen();
    // this is where the ai prediction will be gotten.
    getInput(eventDirection);
    moveSnake();
    if (newApple) {
        setAppleLocation();
    }
    newApple = checkCollision();
    drawApple();
    drawSnake();
    if (!checkWin()) {
        setTimeout(runGame, frameInterval);
    } else {
        winScreen();
    }
}

initializeBoxes(dimension);
runGame();