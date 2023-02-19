
// noinspection DuplicatedCode
class ColorHelper {
  static RGBToHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;

    return "#" + r + g + b;
  }
  static CssRGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substring(4).split(")")[0].split(sep);

    for (let R in rgb) {
      let r = rgb[R];
      console.log(r)
      if (r.indexOf("%") > -1)
        rgb[R] = Math.floor(r.substring(0, r.length - 1) / 100 * 255);
    }

    let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;


    return "#" + r + g + b;
  }

  static RGBAToHexA(r,g,b,a) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = Math.round(a * 255).toString(16);


    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;
    if (a.length === 1)
      a = "0" + a;

    return "#" + r + g + b + a;
  }

  static CssRGBAToHexA(rgba) {
    let sep = rgba.indexOf(",") > -1 ? "," : " ";
    rgba = rgba.substring(5).split(")")[0].split(sep);

    // Strip the slash if using space-separated syntax
    if (rgba.indexOf("/") > -1)
      rgba.splice(3,1);

    for (let R in rgba) {
      let r = rgba[R];
      if (r.indexOf("%") > -1) {
        let p = r.substring(0,r.length - 1) / 100;

        if (R < 3) {
          rgba[R] = Math.round(p * 255);
        } else {
          rgba[R] = p;
        }
      }
    }

    let r = (+rgba[0]).toString(16),
      g = (+rgba[1]).toString(16),
      b = (+rgba[2]).toString(16),
      a = Math.round(+rgba[3] * 255).toString(16);

    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;
    if (a.length === 1)
      a = "0" + a;

    return "#" + r + g + b + a;
  }

  static hexToRGB(h,isPct = false) {
    let r = 0, g = 0, b = 0;

    if (h.length === 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];

    } else if (h.length === 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }

    if (isPct) {
      r = +(r / 255 * 100).toFixed(1);
      g = +(g / 255 * 100).toFixed(1);
      b = +(b / 255 * 100).toFixed(1);
    }

    return "rgb(" + (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")";
  }

  static hexAToRGBA(h, isPct = false) {
    let r = 0, g = 0, b = 0, a = 1;

    if (h.length === 5) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
      a = "0x" + h[4] + h[4];

    } else if (h.length === 9) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
      a = "0x" + h[7] + h[8];
    }
    a = +(a / 255).toFixed(3);

    if (isPct) {
      r = +(r / 255 * 100).toFixed(1);
      g = +(g / 255 * 100).toFixed(1);
      b = +(b / 255 * 100).toFixed(1);
      a = +(a * 100).toFixed(1);
    }

    return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
  }

  static RGBToHSL(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // Calculate hue
    // No difference
    if (delta === 0)
      h = 0;
    // Red is max
    else if (cmax === r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
      h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsl(" + h + "," + s + "%," + l + "%)";

  }

  static CssRGBToHSL(rgb, isPct = false) {
    if (isPct) {
      let sep = rgb.indexOf(",") > -1 ? "," : " ";
      rgb = rgb.substring(4).split(")")[0].split(sep);

      for (let R in rgb) {
        let r = rgb[R];
        if (r.indexOf("%") > -1)
          rgb[R] = Math.round(r.substring(0,r.length - 1) / 100 * 255);
      }

    }

    // Make r, g, and b fractions of 1
    let r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // Calculate hue
    // No difference
    if (delta === 0)
      h = 0;
    // Red is max
    else if (cmax === r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
      h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsl(" + h + "," + s + "%," + l + "%)";

  }

  static RGBAToHSLA(r,g,b,a) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // Calculate hue
    // No difference
    if (delta === 0)
      h = 0;
    // Red is max
    else if (cmax === r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
      h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsla(" + h + "," + s + "%," +l + "%," + a + ")";
  }

  static HSLToHex(h,s,l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;

    return "#" + r + g + b;
  }

  static CssHSLToHex(hsl) {
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substring(4).split(")")[0].split(sep);

    let h = hsl[0],
      s = hsl[1].substring(0,hsl[1].length - 1) / 100,
      l = hsl[2].substring(0,hsl[2].length - 1) / 100;

    // Strip label and convert to degrees (if necessary)
    if (h.indexOf("deg") > -1)
      h = h.substring(0,h.length - 3);
    else if (h.indexOf("rad") > -1)
      h = Math.round(h.substring(0,h.length - 3) * (180 / Math.PI));
    else if (h.indexOf("turn") > -1)
      h = Math.round(h.substring(0,h.length - 4) * 360);
    if (h >= 360)
      h %= 360;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;

    return "#" + r + g + b;
  }

}

class ElementAttribute {
  constructor (name, value) {
    this.name = name;
    this.value = value;
  }
}

class Component {
  constructor (parentId, shouldRender = true) {
    this.parentId = parentId
    if (shouldRender) this.render()
  }

  render() {}

  createComponent(tag, cssClasses, attributes) {
    const element = document.createElement(tag);
    if ( cssClasses ) element.className = cssClasses;
    if ( attributes && attributes.length > 0) {
      attributes.forEach((attr) => {
        element.setAttribute(attr.name, attr.value)
      })
    }
    document.getElementById(this.parentId).append(element)
    return element;
  }
}

class MainColor extends Component{
  constructor (parentId, index, parentRadius, diameter, hueIncrement, amount, offset, isClockwise, cssClasses ) {
    super(parentId, false);
    this.index = index;
    this.offset = offset
    this.parentRadius = parentRadius;
    this.diameter = diameter;
    this.hueIncrement = hueIncrement;
    this.amount = amount;
    this.hue = hueIncrement * index;
    this.isClockwise = isClockwise;
    this.cssClasses = cssClasses;

    this.hslString = `hsl(${this.hue} 100% 50%)`
    this.colorName = ntc.name(ColorHelper.CssHSLToHex(this.hslString));
    this.render();
  }


  clickEventHandler = (angle) => {
    const colors = document.getElementsByClassName('active-color')
    for(let i = 0; i < colors.length; i++) {
      colors[i].classList.remove('active-color')
    }
    this.element.classList.add('active-color')
    const parent = document.getElementById(this.parentId)
    parent.style.transform = `translate(-50%, -50%) rotate(${-angle}deg) scale(1.2)`
  }

  render() {
    const r = this.parentRadius;
    const color = this.createComponent('div', this.cssClasses )
    color.style.width = this.diameter + 'px'
    color.style.height = this.diameter + 'px'
    color.style.lineHeight = this.diameter + 'px'
    color.style.background = `hsl(${this.hue} 100% 50%)`
    color.style.top = String(r + -r * Math.cos((360 / this.amount / 180) * (this.index + this.offset) * Math.PI)) + 'px';
    color.style.left = String(r + r * (this.isClockwise ? Math.sin((360 / this.amount / 180) * (this.index + this.offset) * Math.PI) : -Math.sin((360 / this.colorAmount / 180) * (this.index + this.offset) * Math.PI))) + 'px'

    this.element = color;
    color.addEventListener('click', this.clickEventHandler.bind(this, this.index * 30))
  }

}

class Palette extends Component {
  mainColors = []
  constructor (parentId, radius, startOffset, colorSize, colorClass, paletteId, amount, hueIncrement, clockwise = true ) {
    super(parentId, false);
    this.isClockwise = clockwise
    this.id = paletteId;
    this.radius = radius;
    this.colorAmount = amount
    this.offset = startOffset;
    this.incrementHue = hueIncrement
    this.colorSize = colorSize;
    this.colorClass = colorClass;
    this.render();
    this.initializeEvents()
  }

  initializeEvents() {
    this.mainColors.forEach((color) => {
      // color.addEventListener()
    })
  }

  render() {
    const r = this.radius;
    const palette = this.createComponent('div', 'main-colors', [
      new ElementAttribute('id', this.id)
    ])
    palette.style.width = ((r * 2) + this.colorSize) + 'px';
    palette.style.height = ((r * 2) + this.colorSize) + 'px';



    for (let i = 0; i < this.colorAmount; i++) {
      const color = new MainColor(this.id, i, this.radius, this.colorSize, this.incrementHue, this.colorAmount, this.offset, this.isClockwise, this.colorClass )
      this.mainColors.push(color)
    }
  }
}




class App {
  static init() {
    new Palette('app', 200, 0, 30, 'colors', 'palette', 12, 30)
  }
}

App.init()