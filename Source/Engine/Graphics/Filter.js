class filter {
  constructor(a) {
    if(a == undefined) {
      this.effects = [];
    }
    else if(typeof a == 'object') {
      this.effects = a.effects;
    }
    else {
      this.effects = [];
      this.effects.push(a);
    }
  }
  addEffect(effect) {
    this.effects.push(effect);
  }
  getColor(color) {
    let result = color.clone();
    for (let i = 0; i < this.effects; i++) {
      result = this.effects[i](result);
    }
    return result;
  }
}