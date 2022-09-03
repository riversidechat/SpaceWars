class loop {
  constructor(func) {
    this.func = func;
    this.ticks = 0;
  }
  start() {
    this.ticks = 0;
    window.requestAnimationFrame(this.func);
  }
  update() {
    this.ticks++;
    window.requestAnimationFrame(this.func);
  }
}