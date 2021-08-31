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
    
    // takes in tensor 
    // returns 
    forward(state) {
        return tf.tidy(() =>{
            let inputTensor = tf.tensor(state, [1, 11]);
            let output = this.model.predict(inputTensor);

            // argMax returns index of largest value.
            return output.dataSync();
            // return Array.from(output.dataSync());
            // return aiDirection[output.argMax(1).dataSync()[0]];
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
        // let state = tf.tensor1d(oldstate, dtype='float32');
        // let nextState= tf.tensor1d(next, dtype='float32');
        // let reward = tf.tensor1d(rewardd, dtype='float32');
        // let action = tf.tensor1d(actionn, dtype='float32');

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
            console.log(qNew);
            target[i][maxIndex(actions[i])] = qNew;
            // let predTensor = tf.tensor1d(pred[i]);
            // this.fitModel(oldStates[i], target[i]);
        }
    
    }

    async fitModel(input, target) {
        // let oldStateTensor = tf.tensor2d([oldState])
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


// // using adam optimizer for network and meanSquaredError

// const adamOpt = tf.train.adam(.001);
// model.compile({
//   optimizer: adamOpt,
//   loss: 'meanSquaredError'
// })

// async function save(model) {
//     await model.save('indexeddb://my-model');
// }

// async function fitModel(stateHistory) {
//   for (var i = 0; i < stateHistory.length; i++) {
//      const expected = tf.oneHot(tf.tensor1d([getExpected(stateHistory[i])], 'int32'), 3).cast('float32');
//      posArr = tf.tensor2d([stateHistory[i]]);
//      const h = await model.fit(posArr, expected, {
//          batchSize: 3,
//          epochs: 1
//      });
//      expected.dispose();
//      posArr.dispose();
//   }
// }


// // input getState
// function forward(input) {
//     return tf.tidy(() =>{
//       let inputTensor = tf.tensor2d([input]);
//       let output = model.predict(inputTensor);
//       return aiDirection[output.argMax(1).dataSync()[0]];
//     }
//   ) 
// }

// function trainer(network, learningRate, gamma) {
  
// }
