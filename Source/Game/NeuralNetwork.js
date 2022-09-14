function sigmoid(x) {
    if(x instanceof matrix) {
        return matrix.map(x, (value) => { return (1 / (1 + Math.exp(-value))); })
    } else {
        return (1 / (1 + Math.exp(-x)));
    }
}
sigmoid.string = "sigmoid";
function sigmoid_prime(x) {
    if(x instanceof matrix) {
        return matrix.map(x, (value) => { return sigmoid(value) * (1 - sigmoid(value)); })
    } else {
        return sigmoid(x) * (1 - sigmoid(x));
    }
}
function tanh(x) {
    if(x instanceof matrix) {
        return matrix.map(x, (value) => { return Math.tanh(x); })
    } else {
        return Math.tanh(x);
    }
}
tanh.string = "tanh";
function tanh_prime(x) {
    if(x instanceof matrix) {
        return matrix.map(x, (value) => { return 1 - Math.pow(Math.tanh(x), 2); })
    } else {
        return 1 - Math.pow(Math.tanh(x), 2);
    }
}

class NeuralNetwork {
    constructor(a) {
        if(a instanceof NeuralNetwork) {
            this.topology = a.topology;

            this.activation = a.activation;
            this.derivitive = a.derivitive;

            this.old_inputs = a.old_inputs;

            this.biases = new Array(a.biases.length);
            this.weights = new Array(a.weights.length);
            for(let i = 0; i < a.weights.length; ++i) {
                this.weights[i] = a.weights[i].clone();
            }
            for(let i = 0; i < a.biases.length; ++i) {
                this.biases[i] = a.biases[i].clone();
            }
        } else if(a instanceof Array) {
            this.topology = a;

            this.activation = tanh;
            this.derivitive = tanh_prime;

            this.old_inputs = [];

            this.biases = new Array(a.length - 1);
            this.weights = new Array(a.length - 1);
            for(let i = 0; i < this.weights.length; ++i) {
                let rows = a[i + 1];
                let cols = a[i];
                this.weights[i] = new matrix(rows, cols);
                this.weights[i].randomize(-1, 1);

                this.biases[i] = new matrix(rows, 1);
                this.biases[i].forEach(() => { return 1; });
            }
        } else {
            this.topology = [];

            this.activation = sigmoid;
            this.derivitive = sigmoid_prime;

            this.old_inputs = [];

            this.biases = [];
            this.weights = [];
        }
    }
    train(inputs, targets) {
        if(inputs.length != this.topology[0]) { console.error("Wrong number of inputs"); return; }

        let delta_biases = new Array(this.biases.length);
        let delta_weights = new Array(this.weights.length);

        let layer_outputs = new Array(this.topology.length);
        layer_outputs[0] = matrix.fromArray(inputs);
        let zs = new Array(this.weights.length);
        let layer_output = matrix.fromArray(inputs);

        for(let i = 0; i < this.weights.length; ++i) {
            let z = matrix.add(matrix.dot(this.weights[i], layer_output), this.biases[i]);
            zs[i] = z;
            layer_output = matrix.map(z, this.activation);
            layer_outputs[i + 1] = layer_output;
        }

        let delta = matrix.multiply(matrix.multiply(this.cost_derivative(layer_outputs[layer_outputs.length - 1], matrix.fromArray(targets)), this.derivitive(zs[zs.length - 1])), this.lr);
        delta_biases[delta_biases.length - 1] = delta
        delta_weights[delta_weights.length - 1] = matrix.dot(delta, layer_outputs[layer_outputs.length - 2].transpose());

        for(let l = this.weights.length - 2; l >= 0; l--) {
            let z = zs[l];
            let sp = this.derivitive(z);
            delta = matrix.multiply(matrix.multiply(matrix.dot(this.weights[l+1].transpose(), delta), sp), this.lr);
            delta_biases[l] = delta;
            delta_weights[l] = matrix.dot(delta, layer_outputs[l].transpose());
        }

        this.old_inputs = inputs
        return [delta_biases, delta_weights];
    }
    feedForward(inputs) {
        if(inputs.length != this.topology[0]) { console.error("Wrong number of inputs"); return; }
        
        let layer_output = matrix.fromArray(inputs);
        
        for(let i = 0; i < this.weights.length; ++i) {
            layer_output = matrix.map(matrix.add(matrix.dot(this.weights[i], layer_output), this.biases[i]), this.activation);
        }
        
        this.old_inputs = inputs
        return layer_output.toArray();
    }
    cost_derivative(output, target) {
        return (matrix.subtract(target, output))
    }
    mutate(func) {
        for(let i = 0; i < this.weights.length; ++i) {
            this.weights[i].forEach(func);
        }
        for(let i = 0; i < this.biases.length; ++i) {
            this.biases[i].forEach(func);
        }
    }
    draw(position, inputs = this.old_inputs) {
        const size = 20;
        const spacing_x = 10;
        const spacing_y = 2;
        const negative_color = color.create(12, 14, 146);
        const positive_color = color.create(16, 146, 12);
        if(inputs.length != this.topology[0]) { console.error("Wrong number of inputs"); return; }
        let layer_output = matrix.fromArray(inputs);

        renderer.strokeWeight = 1;
        for(let neuron = 0; neuron < inputs.length; ++neuron) {
            let neuron_position = vec2.create(0, (neuron - (inputs.length / 2)) * (size * (spacing_y + 0.5))).add(position);
            for(let weight = 0; weight < this.weights[0].data.length; ++weight) {
                renderer.strokeColor = color.lerp(positive_color, negative_color, (inputs[neuron] * this.weights[0].data[weight][neuron] + 1) / 2);
                renderer.strokeWeight = Math.abs(this.weights[0].data[weight][neuron]) * 3;
                renderer.line(neuron_position, vec2.create((size * (spacing_x + 0.5)), (weight - (this.weights[0].data.length / 2)) * (size * (spacing_y + 0.5))).add(position))
            }
        }
        for(let layer = 0; layer < this.weights.length - 1; ++layer) {
            layer_output = matrix.map(matrix.add(matrix.dot(this.weights[layer], layer_output), this.biases[layer]), this.activation);
            for(let neuron = 0; neuron < this.weights[layer].data.length; ++neuron) {
                let neuron_position = vec2.create((layer + 1) * (size * (spacing_x + 0.5)), (neuron - (this.weights[layer].data.length / 2)) * (size * (spacing_y + 0.5))).add(position)
                
                for(let weight = 0; weight < this.weights[layer + 1].data.length; ++weight) {
                    renderer.strokeColor = color.lerp(positive_color, negative_color, (layer_output.data[neuron][0] * this.weights[layer + 1].data[weight][neuron] + 1) / 2);
                    // renderer.strokeColor = (layer_output.data[neuron][0] * this.weights[layer + 1].data[weight][neuron] >= 0)? positive_color : negative_color;
                    renderer.strokeWeight = Math.abs(this.weights[layer + 1].data[weight][neuron]) * 3;
                    renderer.line(neuron_position, vec2.create((layer + 2) * (size * (spacing_x + 0.5)), (weight - (this.weights[layer + 1].data.length / 2)) * (size * (spacing_y + 0.5))).add(position))
                }
            }
        }

        
        for(let neuron = 0; neuron < inputs.length; ++neuron) {
            renderer.strokeColor = color.none;
            renderer.fillColor = color.lerp(negative_color, positive_color, ((inputs[neuron] + 1) / 2));
            let neuron_position = vec2.create(0, (neuron - (inputs.length / 2)) * (size * (spacing_y + 0.5))).add(position);
            renderer.circle(new circle(neuron_position, size));
        }
        layer_output = matrix.fromArray(inputs);
        for(let layer = 0; layer < this.weights.length - 1; ++layer) {
            layer_output = matrix.map(matrix.add(matrix.dot(this.weights[layer], layer_output), this.biases[layer]), this.activation);
            for(let neuron = 0; neuron < this.weights[layer].data.length; ++neuron) {
                renderer.fillColor = color.none;
                renderer.fillColor = color.lerp(negative_color, positive_color, ((layer_output.data[neuron][0] + 1) / 2));
                let neuron_position = vec2.create((layer + 1) * (size * (spacing_x + 0.5)), (neuron - (this.weights[layer].data.length / 2)) * (size * (spacing_y + 0.5))).add(position)
                renderer.circle(new circle(neuron_position, size));
            }
        }
        layer_output = matrix.map(matrix.add(matrix.dot(this.weights[this.weights.length - 1], layer_output), this.biases[this.weights.length - 1]), this.activation);
        for(let neuron = 0; neuron < this.weights[this.weights.length - 1].data.length; ++neuron) {
            renderer.strokeColor = color.none;
            renderer.fillColor = color.lerp(negative_color, positive_color, ((layer_output.data[neuron][0] + 1) / 2));
            let neuron_position = vec2.create((this.weights.length) * (size * (spacing_x + 0.5)), (neuron - (this.weights[this.weights.length - 1].data.length / 2)) * (size * (spacing_y + 0.5))).add(position);
            renderer.circle(new circle(neuron_position, size));
        }
    }
    get area() {
        const size = 20;
        const spacing_x = 10;
        const spacing_y = 2;
        let max_neurons = 0;
        for(let i = 0; i < this.topology.length; ++i) {
            if(this.topology[i] > max_neurons) max_neurons = this.topology[i];
        }
        return new rect(-size, -(((max_neurons / 2) * (size * (spacing_y + 0.5))) + size), ((this.topology.length - 1) * (size * (spacing_x + 0.5))) + (size * 2), ((max_neurons - 1) * (size * (spacing_y + 0.5))) + (size * 2));
    }
    save() {
        let json = JSON.stringify(this);  

        let text = encodeURIComponent( json );
        let link = html.CreateElement("a", {"id": "save", "download": "nn.save", "href": "data:application/octet-stream," + text}, "body");
        let obj = document.querySelector(link);
        obj.click();
    }
    // toString() {
    //     let string = "";

    //     let enter_region = (name) => { push_value(name); string += ':'; }
    //     let exit_region = (name) => { string += '}'; }
    //     let push_value = (value) => {
    //         let type = typeof value;
    //         let seperator;

    //         switch(type) {
    //             case "number": {
    //                 string += (string[string.length - 1] != seperator? seperator : '') + value + seperator;
    //             } break;
    //         }

    //     }
    //     let push_values = (values) => { for(let value of values) { push_value(value); } }

    //     enter_region("topology");
    //         push_values(this.topology);
    //     exit_region();

    //     enter_region("activation");
    //         push_value(this.activation.string);
    //     exit_region();

    //     enter_region("weights");
    //     for(let weight of this.weights) {
    //         enter_region("matrix");
    //         for(let arr of weight.data) {
    //             enter_region("array");
    //                 push_values(arr);
    //             exit_region();
    //         }
    //         exit_region();
    //     }
    //     exit_region();

    //     return string;
    // }
    toString() {
        return JSON.stringify(this.toObj());
    }
    static fromString(string) {
        let parsed = JSON.parse(string);

        let nn = new NeuralNetwork();
        nn.topology = parsed.topology;
        nn.activation = (parsed.activation == "sigmoid"? sigmoid : tanh);
        nn.derivitive = (parsed.activation == "sigmoid"? sigmoid_prime : tanh_prime);

        nn.weights = new Array(parsed.weights.length);
        for(let i = 0; i < parsed.weights.length; ++i) {
            nn.weights[i] = new matrix(parsed.weights[i].data);
        }

        nn.biases = new Array(parsed.biases.length);
        for(let i = 0; i < parsed.biases.length; ++i) {
            nn.biases[i] = new matrix(parsed.biases[i].data);
        }

        return nn;
    }
    toObj() {
        return {topology: this.topology, activation: this.activation.string, weights: this.weights, biases: this.biases};
    }
    fromObj(obj) {
        let nn = new NeuralNetwork();
        nn.topology = obj.topology;
        nn.activation = (obj.activation == "sigmoid"? sigmoid : tanh);
        nn.derivitive = (obj.activation == "sigmoid"? sigmoid_prime : tanh_prime);

        nn.weights = new Array(obj.weights.length);
        for(let i = 0; i < obj.weights.length; ++i) {
            nn.weights[i] = new matrix(obj.weights[i].data);
        }

        nn.biases = new Array(obj.biases.length);
        for(let i = 0; i < obj.biases.length; ++i) {
            nn.biases[i] = new matrix(obj.biases[i].data);
        }

        return nn;
    }
}