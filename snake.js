/* global variables:
dimension
x
y
*/
// makes sure the page is loaded before running the javascript
window.onload = () => {
    // dimension should not be changed
    const dimension = 20;
    const frameInterval = 100;

    let snake = [{x: 0, y: 0}];
    // direction can be left, right, up or down
    let direction = "";

    function clearScreen() {
        for(let i = 0; i < dimension * dimension; i++) {
            let box = document.getElementsByClassName('box')[i];
            box.style.backgroundColor = "white";
        }
    }

    // this function takes in x, y coordinate and returns 
    // string of div.
    function getDiv(x, y) {
        return "div" + '-' + y + '-' + x;
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

    function main() {
        clearScreen();
        drawSnake();
        setInterval(main, frameInterval);
    }

}

