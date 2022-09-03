class color {
  constructor(a, b, c, d) {
    if(a == undefined) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
    }
    else if(b == undefined) {
      if(typeof a != 'object')
        throw "Error: cannot create color with only 1 arg";

      this.r = a.r;
      this.g = a.g;
      this.b = a.b;
      this.a = a.a;
    }
    else if(c == undefined) {
      throw "Error: cannot create color with only 2 args";
    }
    else if(d == undefined) {
      this.r = a;
      this.g = b;
      this.b = c;
      this.a = 1;
    }
    else {
      this.r = a;
      this.g = b;
      this.b = c;
      this.a = d;
    }
  }

  static create(a, b, c, d) {
    return new color(a, b, c, d);
  }
  clone() {
    return new color(this);
  }

  string() {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
  static lerp(a, b, t) {
    return new color(math.lerp(a.r, b.r, t), math.lerp(a.g, b.g, t), math.lerp(a.b, b.b, t), math.lerp(a.a, b.a, t));
  }
  static get maroon()	{ return new color(128,0,0); }
  static get darkRed()	{ return new color(139,0,0); }
  static get brown()	{ return new color(165,42,42); }
  static get firebrick()	{ return new color(178,34,34); }
  static get crimson()	{ return new color(220,20,60); }
  static get red()	{ return new color(255,0,0); }
  static get tomato()	{ return new color(255,99,71); }
  static get coral()	{ return new color(255,127,80); }
  static get indianRed()	{ return new color(205,92,92); }
  static get lightCoral()	{ return new color(240,128,128); }
  static get darkSalmon()	{ return new color(233,150,122); }
  static get salmon()	{ return new color(250,128,114); }
  static get lightSalmon()	{ return new color(255,160,122); }
  static get orangeRed()	{ return new color(255,69,0); }
  static get darkOrange()	{ return new color(255,140,0); }
  static get orange()	{ return new color(255,165,0); }
  static get gold()	{ return new color(255,215,0); }
  static get darkGoldenRod()	{ return new color(184,134,11); }
  static get goldenRod()	{ return new color(218,165,32); }
  static get paleGoldenRod()	{ return new color(238,232,170); }
  static get darkKhaki()	{ return new color(189,183,107); }
  static get khaki()	{ return new color(240,230,140); }
  static get olive()	{ return new color(128,128,0); }
  static get yellow()	{ return new color(255,255,0); }
  static get yellowGreen()	{ return new color(154,205,50); }
  static get darkOliveGreen()	{ return new color(85,107,47); }
  static get oliveDrab()	{ return new color(107,142,35); }
  static get lawnGreen()	{ return new color(124,252,0); }
  static get chartreuse()	{ return new color(127,255,0); }
  static get greenYellow()	{ return new color(173,255,47); }
  static get darkGreen()	{ return new color(0,100,0); }
  static get green()	{ return new color(0,128,0); }
  static get forestGreen()	{ return new color(34,139,34); }
  static get lime()	{ return new color(0,255,0); }
  static get limeGreen()	{ return new color(50,205,50); }
  static get lightGreen()	{ return new color(144,238,144); }
  static get paleGreen()	{ return new color(152,251,152); }
  static get darkSeaGreen()	{ return new color(143,188,143); }
  static get mediumSpringGreen()	{ return new color(0,250,154); }
  static get springGreen()	{ return new color(0,255,127); }
  static get seaGreen()	{ return new color(46,139,87); }
  static get mediumAquaMarine()	{ return new color(102,205,170); }
  static get mediumSeaGreen()	{ return new color(60,179,113); }
  static get lightSeaGreen()	{ return new color(32,178,170); }
  static get darkSlateGray()	{ return new color(47,79,79); }
  static get teal()	{ return new color(0,128,128); }
  static get darkCyan()	{ return new color(0,139,139); }
  static get aqua()	{ return new color(0,255,255); }
  static get cyan()	{ return new color(0,255,255); }
  static get lightCyan()	{ return new color(224,255,255); }
  static get darkTurquoise()	{ return new color(0,206,209); }
  static get turquoise()	{ return new color(64,224,208); }
  static get mediumTurquoise()	{ return new color(72,209,204); }
  static get paleTurquoise()	{ return new color(175,238,238); }
  static get aquaMarine()	{ return new color(127,255,212); }
  static get powderBlue()	{ return new color(176,224,230); }
  static get cadetBlue()	{ return new color(95,158,160); }
  static get steelBlue()	{ return new color(70,130,180); }
  static get cornFlowerBlue()	{ return new color(100,149,237); }
  static get deepSkyBlue()	{ return new color(0,191,255); }
  static get dodgerBlue()	{ return new color(30,144,255); }
  static get lightBlue()	{ return new color(173,216,230); }
  static get skyBlue()	{ return new color(135,206,235); }
  static get lightSkyBlue()	{ return new color(135,206,250); }
  static get midnightBlue()	{ return new color(25,25,112); }
  static get navy()	{ return new color(0,0,128); }
  static get darkBlue()	{ return new color(0,0,139); }
  static get mediumBlue()	{ return new color(0,0,205); }
  static get blue()	{ return new color(0,0,255); }
  static get royalBlue()	{ return new color(65,105,225); }
  static get blueViolet()	{ return new color(138,43,226); }
  static get indigo()	{ return new color(75,0,130); }
  static get darkSlateBlue()	{ return new color(72,61,139); }
  static get slateBlue()	{ return new color(106,90,205); }
  static get mediumSlateBlue()	{ return new color(123,104,238); }
  static get mediumPurple()	{ return new color(147,112,219); }
  static get darkMagenta()	{ return new color(139,0,139); }
  static get darkViolet()	{ return new color(148,0,211); }
  static get darkOrchid()	{ return new color(153,50,204); }
  static get mediumOrchid()	{ return new color(186,85,211); }
  static get purple()	{ return new color(128,0,128); }
  static get thistle()	{ return new color(216,191,216); }
  static get plum()	{ return new color(221,160,221); }
  static get violet()	{ return new color(238,130,238); }
  static get magenta()	{ return new color(255,0,255); }
  static get orchid()	{ return new color(218,112,214); }
  static get mediumVioletRed()	{ return new color(199,21,133); }
  static get paleVioletRed()	{ return new color(219,112,147); }
  static get deepPink()	{ return new color(255,20,147); }
  static get hotPink()	{ return new color(255,105,180); }
  static get lightPink()	{ return new color(255,182,193); }
  static get pink()	{ return new color(255,192,203); }
  static get antiqueWhite()	{ return new color(250,235,215); }
  static get beige()	{ return new color(245,245,220); }
  static get bisque()	{ return new color(255,228,196); }
  static get blanchedAlmond()	{ return new color(255,235,205); }
  static get wheat()	{ return new color(245,222,179); }
  static get cornSilk()	{ return new color(255,248,220); }
  static get lemonChiffon()	{ return new color(255,250,205); }
  static get lightGoldenRodYellow()	{ return new color(250,250,210); }
  static get lightYellow()	{ return new color(255,255,224); }
  static get saddleBrown()	{ return new color(139,69,19); }
  static get sienna()	{ return new color(160,82,45); }
  static get chocolate()	{ return new color(210,105,30); }
  static get peru()	{ return new color(205,133,63); }
  static get sandyBrown()	{ return new color(244,164,96); }
  static get burlyWood()	{ return new color(222,184,135); }
  static get tan()	{ return new color(210,180,140); }
  static get rosyBrown()	{ return new color(188,143,143); }
  static get moccasin()	{ return new color(255,228,181); }
  static get navajoWhite()	{ return new color(255,222,173); }
  static get peachPuff()	{ return new color(255,218,185); }
  static get mistyRose()	{ return new color(255,228,225); }
  static get lavenderBlush()	{ return new color(255,240,245); }
  static get linen()	{ return new color(250,240,230); }
  static get oldLace()	{ return new color(253,245,230); }
  static get papayaWhip()	{ return new color(255,239,213); }
  static get seaShell()	{ return new color(255,245,238); }
  static get mintCream()	{ return new color(245,255,250); }
  static get slateGray()	{ return new color(112,128,144); }
  static get lightSlateGray()	{ return new color(119,136,153); }
  static get lightSteelBlue()	{ return new color(176,196,222); }
  static get lavender()	{ return new color(230,230,250); }
  static get floralWhite()	{ return new color(255,250,240); }
  static get aliceBlue()	{ return new color(240,248,255); }
  static get ghostWhite()	{ return new color(248,248,255); }
  static get honeydew()	{ return new color(240,255,240); }
  static get ivory()	{ return new color(255,255,240); }
  static get azure()	{ return new color(240,255,255); }
  static get snow()	{ return new color(255,250,250); }
  static get black()	{ return new color(0,0,0); }
  static get dimGray()	{ return new color(105,105,105); }
  static get gray() { return new color(128,128,128); }
  static get darkGray()	{ return new color(169,169,169); }
  static get silver()	{ return new color(192,192,192); }
  static get lightGray()	{ return new color(211,211,211); }
  static get gainsboro()	{ return new color(220,220,220); }
  static get whiteSmoke()	{ return new color(245,245,245); }
  static get white()  { return new color(255,255,255); }
  static get none()	{ return new color(0, 0, 0, 0); }
}