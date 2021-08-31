function getRandom(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

class Agent {
    constructor(game, epsilonNum) {
        this.gamma = 0.9;
        this.qnet = new LinearQNet(11,256,3,0.001);
        this.trainer = new QTrainer(this.qnet, this.qnet.learningRate, this.gamma);
        this.model = this.qnet.model;
        this.game = game;
        this.numGames = 0;
        this.epsilonNum = epsilonNum;
        this.epsilon = 0;
        this.memory = [];
        this.memorySize = 0;
        this.MAX_MEMORY = 100000;
        this.BATCH_SIZE = 1000;
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
        this.epsilon = this.epsilonNum - this.numGames;
        let finalMove = [0, 0, 0];
        
        let move;
        if (getRandom(0, 200) < this.epsilon) {
            move = getRandom(0, 2);
            finalMove[move] = 1;
        } else {
            let prediction = this.qnet.forward(state);
            move = maxIndex(prediction);
            finalMove[move] = 1;
        }
        
        return finalMove;
    }
    
    
    trainShort(oldState, action, reward, newState, gameOver) {
        this.trainer.trainStep(oldState, action, reward, newState, gameOver);
    }
    
    trainLong() {
        let oldStates = [];
        let actions = [];
        let rewards = [];
        let nextStates = [];
        let gameOvers = [];
        
        if(this.memory.length > this.BATCH_SIZE) {
            let batch = getRandom(0, this.memory.length - this.BATCH_SIZE);
            
            for(let i = batch; i < this.BATCH_SIZE; i++) {
                oldStates.push(this.memory[i][0]);
                actions.push(this.memory[i][1]);
                rewards.push(this.memory[i][2]);
                nextStates.push(this.memory[i][3]);
                gameOvers.push(this.memory[i][4]);
            }
        } else {
            for(let i = 0; i < this.memory.length; i++) {
                oldStates.push(this.memory[i][0]);
                actions.push(this.memory[i][1]);
                rewards.push(this.memory[i][2]);
                nextStates.push(this.memory[i][3]);
                gameOvers.push(this.memory[i][4]);
            }
        }

        
        this.trainer.trainStep(oldStates, actions, rewards, nextStates, gameOvers);
    }

    remember(oldState, action, reward, newState, gameOver) {
        if(this.memorySize > this.MAX_MEMORY) {
            this.memory.shift();
            this.memorySize--;
        }
        
        this.memory.push([oldState, action, reward, newState, gameOver]);
        this.memorySize++;
    }
    
    getMove(move) {
        switch(maxIndex(move)) {
            case 0:
                return "left";
            case 1:
                return "up";
            case 2:
                return "right";
            default:
                return "up";
        }
    }
}

// (dimension, frameInterval, rewardAmount)
let snake = new Snake(8, 10, 20);

// (game, epsilonNum)
let agent = new Agent(snake, 300);
            
initializeGrid(snake.dimension);

let record = 0;
function train() {
    // console.log(qnet.forward(agent.getState()));
    let oldState = agent.getState();
    
    let move = agent.getAction(oldState);
    let gameOver = snake.playStep(agent.getMove(move));


    let reward = snake.reward;
    let score = snake.score;

    // snake.playStep(snake.eventDirection);
    if(reward > 0 || reward < 0) console.log("reward: ", reward);
    snake.score += reward;
    let newState = agent.getState();
    
    agent.trainShort([oldState], [move], [reward], [newState], [gameOver]);
    agent.remember(oldState, move, reward, newState, gameOver);
    
    snake.reward = 0;
    
    if(gameOver) {
        snake.resetGame();
        agent.numGames++;
        
        agent.trainLong();
        if (score > record){
            record = score; 
            // agent.qnet.save("net");
        }  

        if (score > record) {
            record = score;
        }
        console.log("Game: ", agent.numGames, " Score: ", score, " Record: ", record);
    }
    
    setTimeout(() => {
        train();
    }, snake.frameInterval);
}

train();


