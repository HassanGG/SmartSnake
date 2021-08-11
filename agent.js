// This file combines both the neural network and the game
// Dimension of the snake game, needs to be changed in stylesheet too
const dimension = 8;
const frameInterval = 200;
// Score is incremented by 10 when the snake gets an apple.
let score = 0;


function runGame() {
    clearScreen();
    newApple = checkAppleCollision();
    if (newApple) {
        setAppleLocation();
    }
    getInput(eventDirection);
    moveSnake();
    drawApple();
    
    if(checkWallCollision()) {
        failScreen();
    } else if (checkWin()) {
        winScreen();
    } else {
        drawSnake();
        setTimeout(runGame, frameInterval);
    }

}

initializeBoxes(dimension);
runGame();