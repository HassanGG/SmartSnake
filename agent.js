function getRandom(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

class Agent {
    constructor(game) {
        this.qnet = new LinearQNet(11,256,3,0.001);
        this.trainer = new QTrainer(this.qnet, this.qnet.learningRate, 0.9);
        this.model = this.qnet;
        this.game = game;
        this.numGames = 0;
        this.epsilon = 0;
        this.gamma = 0;
        this.memory = [];
        this.MAX_MEMORY = 100;
        // TODO: Add model and trainer
    }
    
    getState() {
        let state = [];
        let head = this.game.snake[0];
        
        // get the locations of points around snake
        let leftPoint = {x: head.x - 1, y: head.y};
        let rightPoint = {x: head.x + 1, y: head.y};
        let upPoint = {x: head.x, y: head.y + 1};
        let downPoint = {x: head.x, y: head.y - 1};
        
        let goingLeft;
        let goingRight;
        let goingUp;
        let goingDown;
        
        // check seperate direction of snake into 4 variables
        switch(this.game.direction) {
            case "left": 
                goingLeft = true;
                goingRight= goingUp = goingDown = false;
                break;
            case "right": 
                goingRight= true;
                goingLeft= goingUp = goingDown = false;
                break;
            case "up": 
                goingUp = true;
                goingRight= goingLeft = goingDown = false;
                break;
            case "down": 
                goingDown = true;
                goingRight= goingUp = goingLeft= false;
                break;
            default:
                
        }
        
        // Danger straight
        if(goingRight && this.game.checkCollision(rightPoint)) state.push(1);
        else if(goingLeft && this.game.checkCollision(leftPoint)) state.push(1);
        else if(goingUp && this.game.checkCollision(upPoint)) state.push(1);
        else if(goingDown && this.game.checkCollision(downPoint)) state.push(1);
        else state.push(0);
        
        // Danger right
        if(goingRight && this.game.checkCollision(downPoint)) state.push(1);
        else if(goingLeft && this.game.checkCollision(upPoint)) state.push(1);
        else if(goingUp && this.game.checkCollision(rightPoint)) state.push(1);
        else if(goingDown && this.game.checkCollision(leftPoint)) state.push(1);
        else state.push(0);
        
        // Danger left
        if(goingRight && this.game.checkCollision(upPoint)) state.push(1);
        else if(goingLeft && this.game.checkCollision(downPoint)) state.push(1);
        else if(goingUp && this.game.checkCollision(leftPoint)) state.push(1);
        else if(goingDown && this.game.checkCollision(rightPoint)) state.push(1);
        else state.push(0);
        
        // Move Direction
        if(goingLeft) state.push(1); else state.push(0); 
        if(goingRight) state.push(1); else state.push(0);
        if(goingUp) state.push(1); else state.push(0);
        if(goingDown) state.push(1); else state.push(0);
        
        // Food Location
        // food left
        if(this.game.apple.x < head.x) state.push(1); else state.push(0);
        // food right
        if(this.game.apple.x > head.x) state.push(1); else state.push(0);
        // food down
        if(this.game.apple.y < head.y) state.push(1); else state.push(0);
        // food up
        if(this.game.apple.y > head.y) state.push(1); else state.push(0);
        
        return state;
    }

    getAction(state) {
        // TODO: 
        // gets random move
        self.epsilon = 80 - self.numGames;
        let finalMove = [0, 0, 0];
        
        let move;
        if (getRandom(0, 200) < self.epsilon) {
            move = getRandom(0, 2);
            finalMove[move] = 1;
        } else {
            let prediction = this.model.forward(state);
            move = maxIndex(prediction);
            finalMove[move] = 1;
        }
        
        return finalMove;
    }
    
    
    trainShort(oldState, action, reward, newState, gameOver) {
        // TODO: 
        this.trainer.trainStep(oldState, action, reward, newState, gameOver);
    }

    remember(oldState, move, reward, newState, gameOver) {
        if(this.memory.length === this.MAX_MEMORY) {
            this.memory.shift();
        }
        
        let memoryObj = {
            oldState: oldState,
            move: move,
            reward: reward, 
            newState: newState,
            gameOver: gameOver
        }
        
        this.memory.push(memoryObj);
    }
    
    
}

let snake = new Snake(8, 200);
let agent = new Agent(snake);
            
initializeGrid(snake.dimension);

let record = 0;
function train() {
    // console.log(qnet.forward(agent.getState()));
    let oldState = agent.getState();

    let move = agent.getAction(oldState);
    let gameOver = snake.checkGameOver();

    let reward = snake.reward;
    let score = snake.score;

    // TODO: takes in move
    snake.playStep(snake.eventDirection);
    let newState = agent.getState();

    agent.trainShort([oldState], [move], [reward], [newState], [gameOver]);
    agent.remember(oldState, move, reward, newState, gameOver);
    
    if(gameOver) {
        snake.resetGame();
        agent.numGames++;
        if (score > record){
            record = score; 
            //TODO:
            // qnet.save("net");
        }  
        
        console.log("Game: ", agent.numGames, " Score: ", score, " Record: ", record);
    }
    
    setTimeout(() => {
        train();
    }, snake.frameInterval);
}

train();





// // This file combines both the neural network and the game
// // Dimension of the snake game, needs to be changed in stylesheet too
// const frameInterval = 30;
// // Score is incremented by 10 when the snake gets an apple.
// let score = 0;
// let numFrames = 0;
// const frameLimit = 50;
// let reward = 0;
// // test
// let stateHistory = [];
// const MAX_MEMORY = 100;

// // runs the whole network and game 
// function runGame() {
//     clearScreen();
//     newApple = checkAppleCollision();
//     setAppleLocation();
//     // train the snake game
//     // train();
//     // getInput(eventDirection);
//     getAiInput(forward(getState()));
//     // getAiInput(eventDirection);
//     moveSnake();
//     drawApple();
//     // 100 * snake length is how long the snake has to beat the game.
//     score += reward;
//     reward = 0;
//     if(checkCollision(snake[0]) || numFrames > frameLimit * snake.length) {
//         numFrames = 0;
//         failScreen();
//     } else if (checkWin()) {
//         winScreen();
//     } else {
//         drawSnake();
//         numFrames++;
//         setTimeout(runGame, frameInterval);
//     }

// }

// // Get the current state or input for neural network
// // Will be stored 
// function getState() {
//     let state = [];
//     let head = snake[0];
    
//     // get the locations of points around snake
//     let leftPoint = {x: head.x - 1, y: head.y};
//     let rightPoint = {x: head.x + 1, y: head.y};
//     let upPoint = {x: head.x, y: head.y + 1};
//     let downPoint = {x: head.x, y: head.y - 1};
    
//     let goingLeft;
//     let goingRight;
//     let goingUp;
//     let goingDown;
    
//     // check seperate direction of snake into 4 variables
//     switch(this.game.direction) {
//         case "left": 
//             goingLeft = true;
//             goingRight= goingUp = goingDown = false;
//             break;
//         case "right": 
//             goingRight= true;
//             goingLeft= goingUp = goingDown = false;
//             break;
//         case "up": 
//             goingUp = true;
//             goingRight= goingLeft = goingDown = false;
//             break;
//         case "down": 
//             goingDown = true;
//             goingRight= goingUp = goingLeft= false;
//             break;
//         default:
            
//     }
    
//     // Danger straight
//     if(goingRight && checkCollision(rightPoint)) state.push(1);
//     else if(goingLeft && checkCollision(leftPoint)) state.push(1);
//     else if(goingUp && checkCollision(upPoint)) state.push(1);
//     else if(goingDown && checkCollision(downPoint)) state.push(1);
//     else state.push(0);
    
//     // Danger right
//     if(goingRight && checkCollision(downPoint)) state.push(1);
//     else if(goingLeft && checkCollision(upPoint)) state.push(1);
//     else if(goingUp && checkCollision(rightPoint)) state.push(1);
//     else if(goingDown && checkCollision(leftPoint)) state.push(1);
//     else state.push(0);
    
//     // Danger left
//     if(goingRight && checkCollision(upPoint)) state.push(1);
//     else if(goingLeft && checkCollision(downPoint)) state.push(1);
//     else if(goingUp && checkCollision(leftPoint)) state.push(1);
//     else if(goingDown && checkCollision(rightPoint)) state.push(1);
//     else state.push(0);
    
//     // Move Direction
//     if(goingLeft) state.push(1); else state.push(0); 
//     if(goingRight) state.push(1); else state.push(0);
//     if(goingUp) state.push(1); else state.push(0);
//     if(goingDown) state.push(1); else state.push(0);
    
//     // Food Location
//     // food left
//     if(apple.x < head.x) state.push(1); else state.push(0);
//     // food right
//     if(apple.x > head.x) state.push(1); else state.push(0);
//     // food down
//     if(apple.y < head.y) state.push(1); else state.push(0);
//     // food up
//     if(apple.y > head.y) state.push(1); else state.push(0);
    
//     return state;
// }

// function remember() {
//     stateHistory.push(getState());
    
//     if (stateHistory.length > MAX_MEMORY) { 
//         stateHistory.shift();
//     }
    
//     return stateHistory;
// }


// function getExpected(state) {
//   // danger forward
//   if (state[0] === 1) {
//     // danger right 
//     if (state[1] === 1) {
//       // go left
//       return [0, 1, 0];
//     } 
    
//     // danger left 
//     if(state[2] === 1) {
//       // go right
//       return[1, 0, 0];
//     }
      
//     if(getRandom(0, 1) === 1) {
//         return [0, 1, 0];
//     } else {
//         return [1, 0, 0]
//     }
    
//   } 
    
//   // if going left
//   if (state[3] === 1) {
//       // if food left 
//       if(state[7] === 1 ) {
//           return [0, 0, 1];
//       }
//       // if food down and not danger right
//       if(state[9] === 1 && state[1] != 1) {
//           return [0, 1, 0];
//       }
      
//       // if food up and not danger left
//       if(state[10] === 1 && state[2] != 1) {
//           return [1, 0, 0];
//       }
//   }
//   // if going right
//   if (state[4] === 1) {
//       // if food right
//       if(state[8] === 1) {
//           return [0, 0, 1];
//       }
//       // if food down and not danger right
//       if(state[9] === 1 && state[1] != 1) {
//           return [1, 0, 0];
//       }
      
//       // if food up && not danger left
//       if(state[10] === 1 && state[2] != 1) {
//           return [0, 1, 0];
//       }
//   }
    
//   // if going down
//   if (state[6] === 1) {
//       // if food right and not danger left
//       if(state[8] === 1 && state[2] != 1) {
//           return [0, 1, 0];
//       }
//       // if food down
//       if(state[9] === 1) {
//           return [0, 0, 1];
//       }
//       // if food left and not danger right
//       if(state[7] === 1 && state[1] != 1) {
//           return [1, 0, 0];
//       }
//   }
    
//   // if going up
//   if (state[5] === 1) {
//       // if food right
//       if(state[8] === 1) {
//           return [1, 0, 0];
//       }
//       // if food up
//       if(state[10] === 1) {
//           return [0, 0, 1];
//       }
//       // if food left
//       if(state[7] === 1) {
//           return [0, 1, 0];
//       }
//   }
  
//   return [0, 0, 1];
// }

// function parseInput(input) {
  
//   // in the form [right, left, up]
//   if(input[0] === 1) {
//     return "right";
//   }
//   if(input[1] === 1) {
//     return "left";
//   }
//   if(input[2] === 1) {
//     return "up";
//   }
// }

// initializeBoxes(dimension);
// runGame();
