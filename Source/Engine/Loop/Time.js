class time {
  constructor() {
    this.deltaTime = 0;
    this.oldTime = 0;
    this.framesPerSecond = 0;
  }
  update(ts) {
    this.deltaTime = (ts - this.oldTime) / 1000;
    this.oldTime = ts;
    this.framesPerSecond = (1 / this.deltaTime);
  }
}