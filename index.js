const NN = require("./nn");

function runNN(inputs, nn) {
  console.log(`${inputs[0]}, ${inputs[1]}: `, nn.run(inputs));
}

const nn = new NN();

nn.addInput();

nn.addInput();

nn.addHiddenLayer(2);

nn.train(
  [
    [0, 0, 1, 1],
    [0, 1, 0, 1],
  ],
  [0, 1, 1, 0]
);

runNN([0, 1], nn);

runNN([1, 0], nn);

runNN([0, 0], nn);

runNN([1, 1], nn);

runNN([1, 1], nn);

runNN([0, 0], nn);

runNN([0, 1], nn);

runNN([1, 0], nn);
