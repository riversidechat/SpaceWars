class math {
  static #degToRad = (Math.PI / 180);
  static #radToDeg = (180 / Math.PI)
  static distance(x0, y0, x1, y1) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    return Math.sqrt((dx *  dx) + (dy * dy));
  }
  static radians(deg) {
    return deg * math.#degToRad;
  }
  static lerp(a, b, t) {
    return a + (b - a) * t;
  }
  static lerp_tweenIn(a, b, t) {
    return (a + (-(t * t) + 2 * t) * (b - a));
  }
  static lerp_tweenOut(a, b, t) {
    return (a + (t * t) * (b - a));
  }
  static lerp_instant(a, b, t) {
    return Math.floor(t) * (b - a) + a;
  }
  static degrees(rad) {
    return rad * math.#radToDeg;
  }
  static random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  static map(value, minA, maxA, minB, maxB) {
    return (value - minA) * ((maxB - minB) / (maxA - minA)) + minB;
  }
  static random_float(min, max) {
    return Math.random() * (max - min) + min;
  }
  static random_int(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  static random(min, max) {
    return Math.random() * (max - min) + min;
  }
  static angle(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;

    return Math.atan2(dy, dx);
  }
  static wrapMax(x, max) {
    return (max + (x % max)) % max
  }
  static wrapMinMax(x, min, max) {
    return min + math.wrapMax(x - min, max - min);
  }
  static round(value, precision) {
    return (Math.round(value * precision) / precision)
  }
}