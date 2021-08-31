class LinearQNet {

    // 11 256 3 0.001
    constructor(inputNum, hiddenNum, outputNum, learningRate) {
        this.learningRate = learningRate;
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: hiddenNum , activation: 'relu', inputShape: [inputNum]}));
        this.model.add(tf.layers.dense({units: outputNum, activation: 'relu', inputShape: [hiddenNum]}));
        
        this.model.compile({
            loss: 'meanSquaredError',
            optimizer: tf.train.adam(learningRate)
        });
    }
    
    forward(state) {
        return tf.tidy(() =>{
            let inputTensor = tf.tensor(state, [1, 11]);
            let output = this.model.predict(inputTensor);

            return output.dataSync();
          }
        ) 
    }
    
    async save(fileName) {
        await this.model.save('downloads://' + fileName);
    }

}

class QTrainer {
    constructor(model, learningRate, gamma) {
        this.learningRate = learningRate;
        this.gamma = gamma;
        this.qnet = model;
        this.model = this.qnet.model;
    }

    // takes in arrays of each parameter
    trainStep(oldStates, actions, rewards, nextStates, gameOvers) {
        let pred = [];
        let target = []; 
        // add all predictions into prediction array
        for (let i = 0; i < oldStates.length; i++) {
            pred.push(this.qnet.forward(oldStates[i]));
            target.push(this.qnet.forward(oldStates[i]));
        }

        let qNew = 0;
        
        for (let i = 0; i < gameOvers.length; i++) {
            qNew = rewards[i];
            if (!gameOvers[i]) {
                let predNext = this.qnet.forward(nextStates[i]);
                qNew = rewards[i] + this.gamma * Math.max(...predNext);
            }
            target[i][maxIndex(actions[i])] = qNew;
        }
    
    }

    async fitModel(input, target) {
        let oldStateTensor = tf.tensor(input, [1, 11]);
        let targetTensor = tf.tensor(target, [1,3]);
        
        await this.model.fit(oldStateTensor, targetTensor,{
            batchSize: 3,
            epochs: 1
        });

        oldStateTensor.dispose();
        targetTensor.dispose();
    }

}
