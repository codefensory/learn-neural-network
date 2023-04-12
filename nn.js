const { arraysEqual } = require("./utils");

class NN {
  constructor() {
    this.inputs = [];
    this.hiddenLayer = [];
    this.output = new Neuron();
    this.connectors = [];
  }

  addInput() {
    this.inputs.push(new Neuron());
  }

  addHiddenLayer(neuronCount) {
    const layer = [];

    for (let i = 0; i < neuronCount; i++) {
      layer.push(new Neuron());
    }

    const hLength = this.hiddenLayer.length;

    const prevLayer =
      hLength === 0 ? this.inputs : this.hiddenLayer[hLength - 1];

    this.joinLayers(prevLayer, layer);

    this.hiddenLayer.push(layer);
  }

  joinLayers(layerA, layerB) {
    for (let i = 0; i < layerB.length; i++) {
      const neuron = layerB[i];

      const connectors = [];

      for (let j = 0; j < layerA.length; j++) {
        connectors.push(new Connector(layerA[j], neuron));
      }

      neuron.setConnectors(connectors);
    }
  }

  train(inputs, outputs) {
    if (!Array.isArray(inputs) || inputs?.length === 0) {
      throw new Error("Los inputs son requeridos");
    }

    if (!Array.isArray(outputs) || outputs?.length === 0) {
      throw new Error("los outputs son requeridos");
    }

    if (inputs[0].length > outputs.length) {
      throw new Error("No puede haber menos outputs que inputs");
    }

    this._preapreOutput();

    let result = [];

    let currIndex = 0;

    let step = 0;

    while (!arraysEqual(result, outputs)) {
      if (currIndex >= inputs[0].length) {
        console.log("Cantidad excedida");

        break;
      }

      step++;

      const currInputs = inputs.map((input) => input[currIndex]);

      const currOutput = this.run(currInputs);

      console.log("index: ", currIndex);
      console.log("inputs: ", currInputs);
      console.log("output: ", currOutput);
      console.log("output esperado: ", outputs[currIndex]);
      console.log("step: ", step);
      console.log("-----");

      // Se reseteamos y ajustamos si no es correcto
      if (currOutput !== outputs[currIndex]) {
        result = [];

        currIndex = 0;

        this.output.adjust();

        continue;
      }

      result[currIndex] = currOutput;

      currIndex++;
    }
  }

  run(inputs) {
    this.inputs.forEach((input, index) => input.setX(inputs[index]));

    for (let layers of this.hiddenLayer) {
      for (let neuron of layers) {
        neuron.execute();
      }
    }

    return this.output.execute();
  }

  _preapreOutput() {
    const hLength = this.hiddenLayer.length;

    const prevLayer =
      hLength === 0 ? this.inputs : this.hiddenLayer[hLength - 1];

    this.joinLayers(prevLayer, [this.output]);
  }
}

class Neuron {
  constructor() {
    this.b = 1;
    this.connectors = [];
    this.x = 1;
  }

  setConnectors(connectors) {
    this.connectors = connectors;
  }

  setX(x) {
    this.x = x;
  }

  adjust() {
    this._adjustB();

    this.connectors.forEach((connector) => {
      connector.regenerate();

      connector.inputNeuron.adjust();
    });
  }

  execute() {
    // Si la neurona se usa como input
    if (this.connectors.length === 0) {
      return this.x;
    }

    return (this.x = this._activationFunction(this._calculateOutput()));
  }

  _calculateOutput() {
    return (
      this.connectors.reduce(
        (acc, connector) => connector.calculate() + acc,
        0
      ) + this.b
    );
  }

  _activationFunction(value) {
    return Number(value > 0);
  }

  _adjustB() {
    this.b = Math.random() * 10 - 5;
  }
}

class Connector {
  constructor(input, output) {
    this.inputNeuron = input;
    this.outputNeuron = output;
    this.w = 1;
  }

  regenerate() {
    this.w = Math.random() * 10 - 5;
  }

  calculate() {
    return this.inputNeuron.x * this.w;
  }
}

module.exports = NN;
