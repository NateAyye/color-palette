// noinspection DuplicatedCode

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

class MobileHexGrid extends Component {
  constructor (palette, parentId, id, tileSize, layers, shape, gap) {
    super(parentId, false)
    this.id = id
    this.palette = palette
    this.size = tileSize
    this.layers = layers
    this.shape = shape
    this.gap = gap
    this.rightMargin = this.palette.element.getBoundingClientRect().width
    this.render()
  }

  renderCenterDiv() {
    const centerDiv = document.createElement('div')
    centerDiv.className = 'center-grid'
    centerDiv.style.position = 'absolute'
    centerDiv.style.width = this.size + 'px'
    centerDiv.style.height = `calc(${this.size}px * 1.1547)`
    centerDiv.style.top = `50%`
    centerDiv.style.left = `50%`
    centerDiv.style.transform = `translate(-50%, -50%)`
    return centerDiv
  }

  render() {

    const grid = this.createComponent('div', 'mobile-hex-grid', [
      new ElementAttribute('id', this.id)
    ])
    grid.style.minHeight = 'inherit'
    grid.style.marginRight = this.rightMargin + 'px'


    for (let i = 0; i < 6; i++ ) {
      if ( i === 0) {
        grid.append(this.renderCenterDiv())
      }
      const tile = document.createElement('div')
      tile.className = 'm-tile'
      tile.style.position = 'absolute'
      tile.style.width = this.size / 2 + 'px'
      tile.style.height = (this.size / 2) * 1.1547 + 'px'
      tile.style.top = `calc(${String(this.size + -this.size * Math.cos((360 / 6 / 180) * (i + .5) * Math.PI))}px + (50% - ${this.size * 1.25}px))`;
      tile.style.left = `calc(${String(this.size + this.size * Math.sin((360 / 6 / 180) * (i + .5) * Math.PI))}px + (50% - ${this.size * 1.25}px))`;
      tile.style.background = `hsl(${0} 100% ${i * 15}%)`
      tile.style.clipPath = 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)'
      grid.append(tile)
    }

    for (let i = 0; i < 9; i++ ) {
      const tile = document.createElement('div')
      tile.className = 'm-tile'
      tile.style.position = 'absolute'
      tile.style.width = this.size + 'px'
      tile.style.height = (this.size) * 1.1547 + 'px'
      tile.style.top = `calc(${String((this.size * 2) + -(this.size * 2) * Math.cos((360 / 9 / 180) * (i) * Math.PI))}px + (50% - ${this.size * 2.5}px))`;
      tile.style.left = `calc(${String((this.size * 2) + (this.size * 2) * Math.sin((360 / 9 / 180) * (i) * Math.PI))}px + (50% - ${this.size * 2.5}px))`;
      tile.style.background = `hsl(${0} ${10 * i}% 50%)`
      tile.style.clipPath = 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)'
      grid.append(tile)
    }

  }
}

class MobileMainColor extends Component {
  constructor (parentId, id, index, mainColorSize, mainColorAmount) {
    super(parentId, false)
    this.id = id
    this.mainColorAmount = mainColorAmount
    this.mainColorSize = mainColorSize
    this.index = index;
    this.render()
  }

  render() {
    const element = this.createComponent('div', 'm-main-color', [
      new ElementAttribute('id', this.id)
    ])
    element.style.background = `hsl(${this.index * 30} 100% 50%)`
    element.style.height = this.mainColorSize + 'px'
    element.style.width = this.mainColorSize + 'px'
    element.style.margin = '0 10px 0'
    element.style.borderRadius = '50%'

  }
}

class MobilePalette extends Component {
  mainColors = []
  constructor (parentId,id, mainColorAmount) {
    super(parentId, false)
    this.id = id
    this.mainColorAmount = mainColorAmount
    this.render()
  }

  render() {
    const element = this.createComponent('aside', 'mobile-palette', [
      new ElementAttribute('id', this.id)
    ])
    for (let i = 0; i < this.mainColorAmount; i++) {
      const mainColor = new MobileMainColor(this.id, `main-color-${i}`, i, 60,  this.mainColorAmount)
      this.mainColors.push(mainColor)
    }
    this.element = element

  }
}

class App {
  static init() {
    const mPalette = new MobilePalette('app','m-palette', 12, 30)
    new MobileHexGrid(mPalette, 'app', 'm-hex-grid', 50, 3, 'hexagon', 10)
  }
}

App.init()