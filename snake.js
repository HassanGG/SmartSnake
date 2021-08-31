// This file contains all the functions and variables of the game

class Snake {
    constructor(dimension, frameInterval) {
        this.dimension = dimension;
        this.frameInterval = frameInterval;
        this.snake = [{x: Math.floor((dimension-1)/2), y: Math.floor((dimension-1)/2)}];
        this.eventDirection = "";
        this.direction= "";
        this.prevDirection = "";
        this.newApple = true;
        this.apple = {x: this.getRandom(0, 7), y: this.getRandom(0, 7)};
        this.reward = 0;
        this.score = 0
        this.numFrames = 0;
        
        document.addEventListener("keydown", (e) => {
            switch(e.key) {
                case "ArrowRight":
                    this.eventDirection = "right";
                    break;
                case "ArrowLeft":
                    this.eventDirection = "left";
                    break;
                case "ArrowDown":
                    this.eventDirection = "down";
                    break;
                case "ArrowUp":
                    this.eventDirection = "up";
                    break;
            }
        });
    }
    
    // Sets all divs in game grid to white.
    clearScreen() {
        for(let i = 0; i < this.dimension * this.dimension; i++) {
            let box = document.getElementsByClassName('box')[i];
            box.style.backgroundColor = "white";
        }
    }

    // this function takes in x, y coordinate and returns 
    // string of div.
    getDiv(x, y) {
        return "div" + '-' + x + '-' + y;
    }

    // this function changes a grid item's colour based on location.
    setPixel(x, y, colour) {
        if(x < this.dimension && x >= 0 && y < this.dimension && y >= 0) {
            let div = document.getElementById(this.getDiv(x, y));
            div.style.backgroundColor = colour;
        }
    }

    // takes in snake object and draws on screen
    drawSnake() {
        for(let i = 0; i < this.snake.length; i++) {
            this.setPixel(this.snake[i].x, this.snake[i].y, "green");
        }
    }
    
    setInput(chosenDirection) {
        // validate the direction the user inputted.
        switch(chosenDirection) {
            case "right":
                this.direction = (this.prevDirection === "left")? this.direction : "right";
                break;
            case "left":
                this.direction = (this.prevDirection === "right")? this.direction : "left";
                break;
            case "down":
                this.direction = (this.prevDirection === "up")? this.direction : "down";
                break;
            case "up":
                this.direction = (this.prevDirection === "down")? this.direction : "up";
                break;
                default:
                this.direction = chosenDirection;
        }
        // update the previous direction to be current.
        this.prevDirection = this.direction;

        return this.direction;
    }
    
    setAiInput(chosenDirection) {
        let possibleDirections = ["left", "up", "right", "down"];
        let numDirections = 4;
        let prevIndex = possibleDirections.indexOf(this.prevDirection);
        if(prevIndex != -1) {
            switch(chosenDirection) {
                case "left":
                    this.direction = possibleDirections[(prevIndex - 1) % numDirections];
                    if((prevIndex - 1) % numDirections < 0) {
                        this.direction = possibleDirections[numDirections- 1];
                    }
                    this.eventDirection = "up";
                    break;
                case "up":
                    // do nothing
                    break;
                case "right":
                    this.direction = possibleDirections[(prevIndex + 1) % numDirections];
                    this.eventDirection = "up";
                    break;
                
                default:
                    console.log("ERROR: NON POSSIBLE DIRECTION CHOSEN IN getAiInput()");
                                
            }
        } else {
            this.direction = "up";
        }
        
        this.prevDirection = this.direction;
        return this.direction;
    }

    moveSnake() {
        switch(this.direction) {
            case "right":
                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y});
                this.snake[0].x += 1;
                this.snake.pop();
                break;
            case "left":
                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y});
                this.snake[0].x -= 1;
                this.snake.pop();
                break;
            case "up":
                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y});
                this.snake[0].y += 1;
                this.snake.pop();
                break;
            case "down":
                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y});
                this.snake[0].y -= 1;
                this.snake.pop();
                break;
        }
    }

    // checks if snake has collided with edge of game.
    checkCollision(point) {
        let isCollision = false;
        if(point.x < 0 || point.x >= this.dimension) {
            isCollision = true;
        }
        if(point.y < 0 || point.y >= this.dimension) {
            isCollision = true;
        }
        // Check Collision with own body
        for (let i = 1; i < this.snake.length; i++) {
            if (point.x === this.snake[i].x) {
                if (point.y === this.snake[i].y) {
                    isCollision = true;
                }
            }
        }
        return isCollision;
    }

    checkAppleCollision() {
        let newApple = false;
        if (this.snake[0].x === this.apple.x && this.snake[0].y === this.apple.y) {
            newApple = true;
            this.reward = 10;
            this.addSnakePart();
        }
        return newApple;
    }

    addSnakePart() {
        let snakeTail = {x: 0, y: 0};
        snakeTail.x = this.snake[this.snake.length-1].x
        snakeTail.y = this.snake[this.snake.length-1].y;
        this.snake.push(snakeTail);
    }

    resetGame() {
        this.snake = [{x: Math.floor((this.dimension-1)/2), y: Math.floor((this.dimension-1)/2)}];
        this.eventDirection = "";
        this.direction = "";
        this.prevDirection = "";
        this.newApple = true;
        this.apple = {x: this.getRandom(0, 7), y: this.getRandom(0, 7)};
        this.score = 0;
        // fitModel(stateHistory);
        // this.stateHistory = [];
        // runGame();
    }


    getRandom(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    setAppleLocation() {
        if (this.newApple) {
            this.apple.x = this.getRandom(0, this.dimension-1);
            this.apple.y = this.getRandom(0, this.dimension-1);
            for(let i = 0; i < this.snake.length; i++) {
                if (this.apple.x === this.snake[i].x) {
                    if (this.apple.y === this.snake[i].y) {
                        i = 0;
                        this.apple.x = this.getRandom(0, this.dimension-1);
                        this.apple.y = this.getRandom(0, this.dimension-1);
                    }
                }
            }
        }
    }

    drawApple() {
        this.setPixel(this.apple.x, this.apple.y, "red");
    }
    
    checkWin() {
        if (this.snake.length === this.dimension * this.dimension) {
            return true;
        } 
        return false;
    }
    
    checkGameOver() {
        if(this.checkWin()) {
            return true;
        }

        if(this.checkCollision(this.snake[0])) {
            this.reward -= 10;
            return true;
        }
        
        return false;
    }
    
    playStep(move) {
        this.clearScreen();
        this.newApple = this.checkAppleCollision();
        this.setAppleLocation();
        // this.setInput(this.eventDirection);
        // getAiInput(forward(getState()));
        this.setAiInput(move);
        this.moveSnake();
        // 100 * snake length is how long the snake has to beat the game.
        
        if(this.checkGameOver() || this.numFrames > 100 * this.snake.length) {
            this.numFrames = 0;
            return true;
        } else {
            this.drawApple();
            this.drawSnake();
            this.numFrames++;
            return false;
        }
    }
}

function maxIndex(array) {
    let maxIndex = 0;
    let max = array[0];
    for(let i = 0; i < array.length; i++) {
        if (array[i] > max) {
            maxIndex = i;
            max = array[i];
        }
        
    }
    
    return maxIndex;
}

