/* global variables:
dimension
x
y
*/
// makes sure the page is loaded before running the javascript
window.onload = () => {
    // dimension should not be changed
    const dimension = 20;
    const frameInterval = 200;

    let snake = [{x: 0, y: 0}];
    // direction can be left, right, up or down
    let eventDirection = "";
    // this is the direction that has been checked to see if 
    // valid for snake.
    let direction = "";
    let prevDirection = "";

    function clearScreen() {
        for(let i = 0; i < dimension * dimension; i++) {
            let box = document.getElementsByClassName('box')[i];
            box.style.backgroundColor = "white";
        }
    }

    // this function takes in x, y coordinate and returns 
    // string of div.
    function getDiv(x, y) {
        return "div" + '-' + x + '-' + y;
    }

    // this function changes a div's colour based on location.
    function setPixel(x, y, colour) {
        let div = document.getElementById(getDiv(x, y));
        div.style.backgroundColor = colour;
    }

    function drawSnake() {
        for(let i = 0; i < snake.length; i++) {
            setPixel(snake[i].x, snake[i].y, "green");
        }
    }

    document.addEventListener("keydown", (e) => {
        switch(e.key) {
            case "ArrowRight":
                eventDirection = "right";
                break;
            case "ArrowLeft":
                eventDirection = "left";
                break;
            case "ArrowDown":
                eventDirection = "down";
                break;
            case "ArrowUp":
                eventDirection = "up";
                break;
        }


    });

    function getInput() {
        // validate the direction the user inputted.
        switch(eventDirection) {
            case "right":
                direction = (prevDirection === "left")? direction : "right";
                break;
            case "left":
                direction = (prevDirection === "right")? direction : "left";
                break;
            case "down":
                direction = (prevDirection === "up")? direction : "down";
                break;
            case "up":
                direction = (prevDirection === "down")? direction : "up";
                break;
            default:
                direction = eventDirection;
        }
        // update the previous direction to be current.
        prevDirection = direction;
    }

    function moveSnake() {
        switch(direction) {
            case "right":
                snake.unshift({x: snake[0].x, y: snake[0].y});
                snake[0].x += 1;
                snake.pop();
                break;
            case "left":
                snake.unshift({x: snake[0].x, y: snake[0].y});
                snake[0].x -= 1;
                snake.pop();
                break;
            case "up":
                snake.unshift({x: snake[0].x, y: snake[0].y});
                snake[0].y += 1;
                snake.pop();
                break;
            case "down":
                snake.unshift({x: snake[0].x, y: snake[0].y});
                snake[0].y -= 1;
                snake.pop();
                break;
        }


    }


    // checks if snake has collided with edge of game.
    function checkCollision() {
        let isCollision = false;

        if(snake[0].x < 0 || snake[0].x >= dimension) {
            isCollision = true;
        }
        if(snake[0].y < 0 || snake[0].y >= dimension) {
            isCollision = true;
        }

        if(isCollision) {
            resetGame();
            return true;
        }

        return isCollision;
    }

    function resetGame() {
        snake = [{x: 0, y: 0}];
        eventDirection = "";
        direction = "";
        prevDirection = "";
    }

    function main() {
        getInput();
        clearScreen();
        moveSnake();
        checkCollision();
        drawSnake();
        setTimeout(main, frameInterval);
    }
    main();

}

