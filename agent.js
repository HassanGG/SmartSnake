// This file combines both the neural network and the game
// Dimension of the snake game, needs to be changed in stylesheet too
const dimension = 8;
const frameInterval = 200;

function main() {
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
        setTimeout(main, frameInterval);
    }
}

initializeBoxes(dimension);
main();