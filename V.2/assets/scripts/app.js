const COLORS = {
  red: '#F44336',
  pink: '#E91E63',
  purple: '#9C27B0',
  deepPurple: '#673AB7',
  indigo: '#3F51B5',
  blue: '#2196F3',
  lightBlue: '#03A9F4',
  cyan: '#00BCD4',
  teal: '#009688',
  green:'#4CAF50',
  lightGreen:'#8BC34A',
  lime:'#CDDC39',
  yellow:'#FFEB3B',
  amber:'#FFC107',
  orange: '#FF9800',
  deepOrange: '#FF5722',
  brown: '#795548',
  gray: '#9E9E9E',
  blueGray: '#607D8B',
}

class ElementAttribute {
  value;
  name;
  constructor (name, value) {
    this.name = name;
    this.value = value;
  }
}

class ColorHelpers {
  static convertToRGB(color) {

  }
}

class Component {
  parentId;
  constructor (parentId = 'app', shouldRender = true ) {
    this.parentId = parentId;
    this.shouldRender = shouldRender;
    if (shouldRender) this.render()
  }

  render() {}

  createComponent(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if(cssClasses) rootElement.className = cssClasses;
    if(attributes && attributes.length > 0) {
      attributes.forEach(attr => {
        rootElement.setAttribute(attr.name, attr.value)
      })
    }
    document.getElementById(this.parentId).append(rootElement);
    return rootElement;

  }
}

class ColorVarient extends Component {
  siblingElements = []
  constructor (parentId, redValue, greenValue, blueValue) {
    super(parentId, false)
    this.parentId = parentId
    this.originalRedValue = redValue;
    this.originalGreenValue = greenValue;
    this.originalBlueValue = blueValue;
    this.hexValue = `${redValue.toString(16).padStart(2, '0')}${greenValue.toString(16).padStart(2, '0')}${blueValue.toString(16).padStart(2, '0')}`
    this.siblingElements = document.querySelector(`#${parentId}`).children
    while (this.siblingElements.length < 10) {
      this.render(this.siblingElements.length)
    }
  }

  lightenColor() {
    let tempHexValue = this.hexValue;
    tempHexValue = '0x' + tempHexValue;
    tempHexValue = parseInt(tempHexValue, 16);
    tempHexValue = tempHexValue + 0x101010;
    tempHexValue = tempHexValue.toString(16)
    tempHexValue = tempHexValue.replace('-', '0')
    return `#${tempHexValue}`
  }


  render(length) {
    this.element = this.createComponent('div','varient')
    this.element.style.background = `#${this.hexValue}`
    this.element.style.filter = `brightness(1.${length})`
  }
}

class ColorVarientsBody extends Component {
  constructor (parentId, colorName, colorValue) {
    super(parentId, false)
    this.id = `${colorName}-varients`
    this.colorName = colorName;
    this.colorValue = colorValue
    this.convertColorToRGB(colorValue)
    this.show = false;
    this.render()
  }

  getHexValue(color) {
    const tempCanvas = document.createElement('canvas').getContext('2d') ;
    tempCanvas.fillStyle = color;
    return tempCanvas.fillStyle;
  }

  convertColorToRGB(color) {
    const hexValue = color.includes('#') ? color.substring(1) : this.getHexValue(color)
    this.redValue = parseInt(hexValue.substring(0,2), 16);
    this.greenValue = parseInt(hexValue.substring(2,4), 16);
    this.blueValue = parseInt(hexValue.substring(4,6), 16);
  }

  showVarients() {
    const currentOpenTab = document.querySelectorAll('.varients')

    currentOpenTab.forEach( (color) => {
      if (color.style.display === 'flex') {
        color.style.display = 'none';
      }
    })
    this.element.style.display = 'flex';
  }

  render() {
    this.element = this.createComponent('color-varients', 'varients', [
      new ElementAttribute('id', this.id)
    ])
    this.element.style.display = this.show ? 'block' : 'none'
    this.element.style.height = '500px'
    this.element.style.background = `rgb(${this.redValue}, ${this.greenValue}, ${this.blueValue})`
    new ColorVarient(this.id, this.redValue, this.greenValue, this.blueValue)
  }
}

class ColorTab extends Component {
  constructor (parentId, colorName, colorValue) {
    super(parentId, false)
    this.colorName = colorName;
    this.colorValue = colorValue
    this.render()
  }

  showVarients() {
    this.colorVarients.showVarients()
  }

  render() {
    this.element = this.createComponent('div', 'color-palette-tab', [
      new ElementAttribute('id', `${this.colorName}-color-tab`)
    ])
    this.element.style.background = this.colorValue;
    this.element.style.borderRadius = '50%'
    this.colorVarients = new ColorVarientsBody(this.id, this.colorName, this.colorValue)
    this.element.addEventListener('click', this.showVarients.bind(this))
  }
}

class ColorPalette extends Component {
  colorTabs = []
  constructor(parentId, id) {
    super(parentId, false)
    this.id = id;
    this.render()
  }

  render() {
    this.element = this.createComponent('div', 'color-palette-wrapper', [
      new ElementAttribute('id', this.id)
    ])

    Object.keys(COLORS).map((colorName) => {
      const colorTab = new ColorTab('palette', colorName, COLORS[colorName])
      this.colorTabs.push(colorTab)
    })
  }

}

class App {
  static init() {
    new ColorPalette('app', 'palette')
  }
}

App.init()