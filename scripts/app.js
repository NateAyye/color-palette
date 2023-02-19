
class ElementAttribute {
  constructor (name, value) {
    this.name = name;
    this.value = value;
  }
}

class Component {
  constructor (parentId, shouldRender = true, shouldAppend = true) {
    this.parentId = parentId
    this.shouldAppend = shouldAppend
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
    if(this.shouldAppend) {
      document.getElementById(this.parentId).append(element)

    }
    return element;
  }
}

class HexTile extends Component {
  constructor (parentId,) {
    super(parentId, false, false)
    this.render()
  }

  render() {
    this.element = this.createComponent('div', 'hex-tile')
  }
}

class HexGrid extends Component {
  constructor (parentId, colorId, radius, hslString) {
    super(parentId, false, false)
    this.id = `${colorId}-grid`
    this.radius = radius
    this.hslString = hslString
    this.colorId = colorId
    this.render()
  }

  render() {
    this.element = this.createComponent('div', 'hex-grid', [
      new ElementAttribute('id',this.id)
    ])
    this.element.style.width = (this.radius * 1.5) + 'px'
    this.element.style.height = (this.radius * 1.5) + 'px'
    this.element.style.background = this.hslString;
    const inner = document.createElement('div')
    inner.className = 'inner'
    for (let i = 0; i < 19; i++) {
      const hex = document.createElement('div')
      hex.className = 'hex-tile'
      hex.id = `${this.id}-tile-${i + 1}`
      inner.append(hex)
      if(i === 2 || i === 6 || i === 15 ) {
        const breakPoint = document.createElement('br')
        inner.append(breakPoint)
      }
    }
    this.element.append(inner)

  }
}

class MainColor extends Component{
  hexGrid
  constructor (parentId, id, index, parentRadius, diameter, hueIncrement, amount, offset, isClockwise, cssClasses ) {
    super(parentId, false);
    this.index = index;
    this.id = id
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
    const hexGrids = document.getElementsByClassName('hex-grid')
    for(let i = 0; i < hexGrids.length; i++ ) {
      hexGrids[i].remove()
    }

    document.getElementById(this.hexGrid.parentId).append(this.hexGrid.element)

    for(let i = 0; i < colors.length; i++) {
      colors[i].classList.remove('active-color')
    }
    this.element.classList.add('active-color')
    const parent = document.getElementById(this.parentId)
    parent.style.transform = `translate(-50%, -50%) rotate(${-angle}deg) scale(1.2)`
  }

  render() {
    const r = this.parentRadius;
    const color = this.createComponent('div', this.cssClasses, [
      new ElementAttribute('id', this.id)
    ] )
    color.style.width = this.diameter + 'px'
    color.style.height = this.diameter + 'px'
    color.style.lineHeight = this.diameter + 'px'
    color.style.background = `hsl(${this.hue} 100% 50%)`
    color.style.top = String(r + -r * Math.cos((360 / this.amount / 180) * (this.index + this.offset) * Math.PI)) + 'px';
    color.style.left = String(r + r * (this.isClockwise ? Math.sin((360 / this.amount / 180) * (this.index + this.offset) * Math.PI) : -Math.sin((360 / this.colorAmount / 180) * (this.index + this.offset) * Math.PI))) + 'px'

    this.hexGrid = new HexGrid('grids', this.id, r, `hsl(${this.hue} 100% 50%)` )


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
  }


  render() {
    const r = this.radius;
    const palette = this.createComponent('div', 'main-colors', [
      new ElementAttribute('id', this.id)
    ])
    palette.style.width = ((r * 2) + this.colorSize) + 'px';
    palette.style.height = ((r * 2) + this.colorSize) + 'px';



    for (let i = 0; i < this.colorAmount; i++) {
      const color = new MainColor(this.id, `${i}-color`, i, this.radius, this.colorSize, this.incrementHue, this.colorAmount, this.offset, this.isClockwise, this.colorClass )
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