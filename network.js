let aiDirection = ["left", "right", "up"];

const model = tf.sequential();

// Add all the layers to the network 4 layers with input of 11 and output of 3
// Network takes in food direction, danger direction, and current direction of snake.
model.add(tf.layers.dense({units: 256, activation: 'relu', inputShape: [11]}));
// model.add(tf.layers.dense({units: 512,activation: 'relu', inputShape: [256]}));
model.add(tf.layers.dense({units: 256,activation: 'relu', inputShape: [512]}));
model.add(tf.layers.dense({units: 3, activation: 'relu', inputShape: [256]}));

// using adam optimizer for network and meanSquaredError

const adamOpt = tf.train.adam(.001);
model.compile({
  optimizer: adamOpt,
  loss: 'meanSquaredError'
})

async function save(model) {
    await model.save('indexeddb://my-model');
}

async function fitModel(stateHistory) {
  for (var i = 0; i < stateHistory.length; i++) {
     const expected = tf.oneHot(tf.tensor1d([getExpected(stateHistory[i])], 'int32'), 3).cast('float32');
     posArr = tf.tensor2d([stateHistory[i]]);
     const h = await model.fit(posArr, expected, {
         batchSize: 3,
         epochs: 1
     });
     expected.dispose();
     posArr.dispose();
  }
}


// input getState
function forward(input) {
    return tf.tidy(() =>{
      let inputTensor = tf.tensor2d([input]);
      let output = model.predict(inputTensor);
      return aiDirection[output.argMax(1).dataSync()[0]];
    }
  ) 
}

function trainer(network, learningRate, gamma) {
  
}
