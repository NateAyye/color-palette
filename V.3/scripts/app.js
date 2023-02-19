// noinspection DuplicatedCode

const COLORS = [
  '#ffff00',
  '#00ff00',
  '#007900',
  '#00aeae',
  '#0000ff',
  '#7308a5',
  '#ba00ff',
  '#cc00af',
  '#ff0000',
  '#ff4600',
  '#ff7f00',
  '#feb300',
]

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


}




class ElementAttribute {
  name;
  value;
  constructor (name, value) {
    this.name = name;
    this.value = value;
  }
}

class Component {
  element
  parentId
  constructor (parentElementId, shouldRender = true) {
    this.parentId = parentElementId;

    if (shouldRender) this.render();
  }

  render() {}

  createComponent(tag, cssClasses, attributes) {
    const element = document.createElement(tag);
    this.element = element;
    if (cssClasses) element.className = cssClasses;
    attributes?.forEach((attr) => element.setAttribute(attr.name,attr.value))
    document.getElementById(this.parentId).append(this.element)
    return element
  }
}

class ColorVarient extends Component {
  constructor (parentId) {
    super(parentId, false)
    this.render()
  }

   makeCircularHexGrid = (rows, parentId) => {
    if (rows % 2 === 0) {
      return new Error('You Must Please Enter an Odd Number');
    }
    const parentElement = document.getElementById(parentId);
    for ( let i = 0; i < rows; i++) {
      for (let j = 0; j < rows; j++) {

        const renderedHexes = document.getElementsByClassName('hex')
        if (renderedHexes.length === 19) return;
        const hexElement = document.createElement('div');

        hexElement.setAttribute('class', 'hex')

        if (renderedHexes.length === 3 || renderedHexes.length === 7 || renderedHexes.length === 12 || renderedHexes.length === 16) {
          const breakPoint = document.createElement('br')
          parentElement.appendChild(breakPoint)
        }
        parentElement.appendChild(hexElement)
      }
    }
  }

  render() {
    this.createComponent('div', 'hex');
  }
}

class HexGrid extends Component {
  colorVarients = []
  constructor (parentId, parentColor, colorIndex) {
    super(parentId, false)
    this.index = colorIndex
    this.id = `color-grid-${colorIndex}`
    this.parentColor = parentColor
    this.render()
    for( let i = 0; i < 19; i++) {
      this.colorVarients.push(new ColorVarient(this.element.id))
    }
  }

  render() {
    this.createComponent('div', 'hex-grid-container', [
      new ElementAttribute('id', this.id )
    ] )
  }
}
class Palette extends Component {
  mainColors = []
  colorGrids = []
  constructor (parentElementId, thisId) {
    super(parentElementId, false)
    this.id = thisId
    this.render()
  }
  
  renderEllipse(amount, xRadius, yRadius, offset, size, circleId, innerDivs, clockwise) {
    this.radius = xRadius
    let m = document.createElement('div'), ss = document.styleSheets;
    ss[0].insertRule(`#${circleId} { 
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      transition: transform 400ms ease-out;
      border-radius: 50%;
      width: ${String((xRadius * 2) + size)}px;
      height: ${String((yRadius * 2) + size)}px; 
    }`, 1)

    ss[0].insertRule(`.${innerDivs} {
     position: absolute;
     color: papayawhip;
     text-align: center;
     font-family: "Open Sans Condensed", sans-serif;
     border-radius: 50%;
     transition: transform 0.2s ease;
     width: ${size}px;
     height: ${size}px;
     line-height: ${size}px;
    }`, 1)

    ss[0].insertRule(`.${innerDivs}:hover {
      transform: scale(1.5);
      cursor: pointer;
      background: rgba(0, 0, 0, 0.8);
    }`, 1)

    m.id = circleId;
    for (let i = 0; i < amount; i++) {
      let c = document.createElement('div');
      c.index = i
      c.className = innerDivs;
      c.id = `color-${i + 1}`
      c.style.background = COLORS[i];
      c.style.top = String(yRadius + -yRadius * Math.cos((360 / amount / 180) * (i + offset) * Math.PI)) + 'px';
      c.style.left = String(xRadius + xRadius * (clockwise ? Math.sin((360 / amount / 180) * (i + offset) * Math.PI) : -Math.sin((360 / amount / 180) * (i + offset) * Math.PI))) + 'px';
      m.appendChild(c);
      this.mainColors.push(c)
    }
    document.body.appendChild(m);
  }

  mainColorClickHandler(e,mainColor, parentId) {
    const allHexGrids = document.getElementsByClassName('hex-grid-container')
    if(mainColor.classList.contains('active-color')) return;
    for(let i = 0; i < allHexGrids.length; i++ ) {
      allHexGrids[i].style.display = 'none'
      allHexGrids[i].classList.remove('active-grid')
      allHexGrids[i].style.transition = ''
      allHexGrids[i].style.transform = ''
    }
    const currentColorGrid = document.getElementById(`color-grid-${mainColor.index}`)
    currentColorGrid.style.display = 'flex'
    const parent = document.getElementById(parentId)
    document.querySelectorAll('.active-color')
      .forEach((el) => el.classList.remove('active-color'))
    mainColor.classList.add('active-color');
    parent.style.transform = `translate(-50%, -50%) scale(1) rotate(${-30 * mainColor.index}deg)`
  }
  
  render() {
    this.renderEllipse(
      12,
      200,
      200,
      0,
      40,
      this.id,
      'colors',
      true
    )

    this.mainColors.forEach((mainColor) => {
      mainColor.addEventListener('click', (e) => {this.mainColorClickHandler( e, mainColor, this.id)} )
    })
    this.mainColors.forEach((color) => {
      this.colorGrids.push(new HexGrid('app', color, color.index))
    })

  }
}




class App {
  static init() {
    new Palette('app', 'palette')
  }
}

App.init()