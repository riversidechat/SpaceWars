class key {
  constructor() {
    this.down = false;
    this.pressed = false;
    this.released = false;
  }
}

class keyboard {
  static #state = new Map();

  static keys = {
    "backspace": 8,
    "tab": 9,
    "enter": 13,
    "shift_right": 16,
    "shift_left": 16,
    "ctrl_left": 17,
    "ctrl_right": 17,
    "alt_left": 18,
    "alt_right": 18,
    "pause": 19,
    "caps_lock": 20,
    "escape": 27,
    "space": 32,
    "page_up": 33,
    "page_down": 34,
    "end": 35,
    "home": 36,
    "left_arrow": 37,
    "up_arrow": 38,
    "right_arrow": 39,
    "down_arrow": 40,
    "print_screen": 44,
    "insert": 45,
    "delete": 46,
    "zero": 48,
    "one": 49,
    "two": 50,
    "three": 51,
    "four": 52,
    "five": 53,
    "six": 54,
    "seven": 55,
    "eight": 56,
    "nine": 57,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90,
    "meta_left": 91,
    "meta_right": 92,
    "select": 93,
    "numpad_zero": 96,
    "numpad_one": 97,
    "numpad_two": 98,
    "numpad_three": 99,
    "numpad_four": 100,
    "numpad_five": 101,
    "numpad_six": 102,
    "numpad_seven": 103,
    "numpad_eight": 104,
    "numpad_nine": 105,
    "numpad_multiply": 106,
    "numpad_add": 107,
    "numpad_subtract": 109,
    "numpad_decimal": 110,
    "numpad_divide": 111,
    "f1": 112,
    "f2": 113,
    "f3": 114,
    "f4": 115,
    "f5": 116,
    "f6": 117,
    "f7": 118,
    "f8": 119,
    "f9": 120,
    "f10": 121,
    "f11": 122,
    "f12": 123,
    "num_lock": 144,
    "scroll_lock": 145,
    "semi_colon": 186,
    "equal_sign": 187,
    "comma": 188,
    "minus": 189,
    "period": 190,
    "slash": 191,
    "backquote": 192,
    "bracket_left": 219,
    "backslash": 220,
    "braket_right": 221,
    "quote": 222,
  }
 
  static event(e)
  {
    var key_state = (e.type === "keydown");
    var k = keyboard.#state.get(e.keyCode) || new key();
    if(!k.down)
      k.pressed = key_state;
    k.released = !key_state;
    k.down = key_state;
    keyboard.#state.set(e.keyCode, k)
  }
  static getKey(k) {
    return keyboard.#state.get(k) || new key();
  }
  static update() {
    keyboard.#state.forEach((value, key, map) => {
      if(!(value.down || value.pressed || value.released)) {
        map.delete(key);
      }
      value.pressed = false;
      value.released = false;
    });
  }
}

document.addEventListener("keydown", keyboard.event);
document.addEventListener("keyup", keyboard.event);