let engine_loop = new loop(engine_update);
let engine_time = new time();
engine_loop.start();
let update_accumulator = 0;

let UpdatesPerSecond = 1 / 60;
let timer = 0;

(async () => {
  await setup();
})();

async function engine_update(ts) {
  engine_time.update(ts);
  timer += engine_time.deltaTime;
  update_accumulator = Math.min(update_accumulator + engine_time.deltaTime, (1/5));

  while (update_accumulator >= UpdatesPerSecond) {
    update_accumulator -= UpdatesPerSecond;
    await update(UpdatesPerSecond);
  }
  
  renderer.camera.update(math.clamp(engine_time.deltaTime, 0, 1/5));
  await render(engine_time.deltaTime);
  
  keyboard.update();
  mouse.update();
  engine_loop.update();
}

// function keyboard_event(e) {
//   keyboard.event(e, engine_loop.ticks);
// }
// document.addEventListener("keydown", keyboard_event);
// document.addEventListener("keyup", keyboard_event);