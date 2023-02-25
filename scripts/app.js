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

  createSVG(sizeX, sizeY, id) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('view-box', `0 0 ${sizeX} ${sizeY}`);
    svg.setAttribute('width', sizeX);
    svg.setAttribute('height', sizeY);
    if (id) svg.setAttribute('id', id);

    return svg
  }

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

class Alert extends Component {
  constructor (parentId, message) {
    super(parentId, false, false)
    this.parentId = parentId;
    this.message = message
    this.render()
  }

  render() {
    const element = this.createComponent('div', 'alert')
    element.innerText = this.message
    document.getElementById(this.parentId).firstChild.after( element)

    setTimeout(() => {
      element.remove()
    }, 2500)
  }
}

class ColorFormat extends Component {
  constructor (parentId) {
    super(parentId, false, false)
    this.render()
  }

  render() {
    const element = this.createComponent('div', 'selector')
    element.innerHTML = `
      <label for="color-space">
        Choose A Color Format (default = HEX)
      </label>
      <br />
      <select name="color" id="color-space">
        <option>HEX</option>
        <option>HSL</option>
        <option>RGB</option>
      </select>
    `
    document.body.append(element)

  }
}


class ColorWheel extends Component {

  layersList = []
  constructor (parentId, id, size, gap, layers, slices) {
    super(parentId,false);
    this.id = id;
    this.size = size;
    this.gap = gap;
    this.layers = layers;
    this.slices = slices;
    this.radius = size / 2;
    this.thickness = ((this.radius * .9) - (gap * layers)) / layers;
    this.render();
  }

  convertCentralAngle(arcLength, radius) {
    return arcLength / radius
  }

  pointConversion(index, radius, sliceAngle) {
    const x1 = (this.size / 2) + radius * Math.cos(((sliceAngle * index) * Math.PI / 180) + this.convertCentralAngle(this.gap, radius));
    const y1 = (this.size / 2) + radius * Math.sin(((sliceAngle * index) * Math.PI / 180) + this.convertCentralAngle(this.gap, radius));
    const x2 = (this.size / 2) + radius * Math.cos(((sliceAngle * (index + 1)) * Math.PI / 180));
    const y2 = (this.size / 2) + radius * Math.sin(((sliceAngle * (index + 1)) * Math.PI / 180));

    return {x1:x1,y1:y1,x2:x2,y2:y2}
  }

  createPath(index, radius, sliceAngle, layer) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const outerLine = this.pointConversion(index, radius, sliceAngle);
    const innerLine = this.pointConversion(index, radius - this.thickness, sliceAngle);
    const tOriginX = this.size / 2 + (radius - this.thickness / 3) * Math.cos(((((sliceAngle * index) + (sliceAngle / 2))) * Math.PI / 180) + (this.convertCentralAngle(this.gap, radius) / 2 ));
    const tOriginY = this.size / 2 + (radius - this.thickness / 3) * Math.sin(((((sliceAngle * index) + (sliceAngle / 2))) * Math.PI / 180)  + (this.convertCentralAngle(this.gap, radius) / 2)) ;


    path.setAttribute('id', `color-${index + 1}-${radius}`);
    path.setAttribute('data-circle-id', `circle-${index + 1}-${radius}` );
    path.setAttribute('d', `
      M ${outerLine.x1} ${outerLine.y1}
      A ${radius} ${radius} 0 0 1 ${outerLine.x2} ${outerLine.y2} 
      L ${innerLine.x2} ${innerLine.y2} 
      A ${(radius * 2 - this.thickness) / 2} ${(radius * 2 - this.thickness) / 2} 0 0 0 ${innerLine.x1} ${innerLine.y1}
      z 
    `)
    path.setAttribute('stroke', 'white');
    path.setAttribute('fill', `hsl(${(360 / this.slices) * index} 100% ${10 + ((90 / this.layers) * layer)}%)`)
    path.setAttribute('stroke-width', '0')
    path.style.transformOrigin = `${tOriginX}px ${tOriginY}px`

    path.addEventListener('mouseover', ev => {
      const tempPath = path;
      path.remove()
      document.querySelector(`.main svg`).append(tempPath)
    })

    path.addEventListener('click', ev => {
      const rgbString = getComputedStyle(path).fill
      const select = document.getElementById('color-space')
      let colorFunction
      switch (select.selectedOptions[0].innerText) {
        case 'HEX':
          colorFunction = ColorHelper.CssRGBToHex(rgbString)
          break;
        case 'HSL':
          colorFunction = ColorHelper.CssRGBToHSL(rgbString, true)
          break;
        case 'RGB':
          colorFunction = rgbString
      }


      navigator.clipboard.writeText(colorFunction)
        .then(r => {
          new Alert('outer', `Copied!! ${colorFunction}`)
        })
        .catch(err => console.log(err))
    })

    return path
  }

  createLayer(index, size) {
    const layer = []
    const r = size / 2 - 10, sliceAngle = 360 / this.slices

    for(let i = 0; i < this.slices; i++) {
      const  path = this.createPath(i, r, sliceAngle, index)
      layer.push(path)
    }
    return layer
  }

  render() {
    this.rootElement = this.createComponent('div', this.id);
    this.svg = this.createSVG(this.size,this.size, 'color-wheel')
    this.ss = document.styleSheets[0];
    const baseSize = this.size

    this.ss.insertRule(`body {
        background: #22222288;
        min-height: 100vh;
        display: grid;
        place-items: center;
    }`, 0)

    this.ss.insertRule(`.${this.id} {
      width: ${this.size}px;
      height: ${this.size}px;
    }`, 0)

    this.ss.insertRule(`.main path:hover {
      transform: scale(1.5);
    }`, 0)

    this.ss.insertRule(`.alert {
        display: grid;
        place-items: center;
        font-family: "Segoe UI", sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        background: #22222288;
        padding: 0 2rem;
        border-radius: .5rem;
        margin: .25rem 0 0 .5rem;
        width: max-content;
        color: white;
        animation: fade-out 2500ms ease-out;
    }`, 0)

    this.ss.insertRule(`.alert:last-of-type {
    }`, 0)

    this.ss.insertRule(`.selector {
        text-align: center;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 3rem;
        background: #a0ffff;
    }`, 0)

    this.ss.insertRule(`
    @keyframes fade-out {
      0% {
        opacity: 100%;
      }

      100% {
        opacity: 0;
      }
    }`, 0)

    for (let i = 0; i < this.layers; i++) {
      this.layersList.push(this.createLayer(i, baseSize - (i * (this.thickness * 2 + (this.gap * 2))) ))
    }

    this.layersList.forEach(layer => {
      layer.forEach(ring => {

        this.svg.append(ring)

      })
    })

    this.rootElement.append(this.svg)
  }
}

class SideBarToggleButton extends Component {
  constructor (parentId) {
    super(parentId, false, false)
    this.render();
  }

  render() {
    const button = this.createComponent('button', 'toggle-button')
    const svg = this.createSVG(50, 50, 'hamburger');
    svg.innerHTML = `
    <g id="Layer_1-2" data-name="Layer 1">
      <g>
        <rect x="5" y="22" width="40" height="6" rx="2" ry="2"/>
      </g>
      <g>
        <rect x="5" y="37" width="40" height="6" rx="2" ry="2"/>
      </g>
      <g>
        <rect x="5" y="7" width="40" height="6" rx="2" ry="2"/>
      </g>
    </g>
    `
    button.addEventListener('click', ev => {
      const aside = document.querySelector('.side-bar')
      aside.classList.toggle('active');
    })

    button.append(svg)
    return button
  }

}

class NavBar extends Component {
  constructor (parentId, id) {
    super(parentId, false, false)
    this.id = id;
    this.render()
  }

  renderBrand() {
    const img =document.createElement('img');
    img.src = "../../public/svg/Brand.svg";
    img.height = 50;
    img.width = 100;
    return img
  }

  render() {
    const outerDiv = document.createElement('div')
    outerDiv.id = 'outer'
    const element = this.createComponent('div','navbar', [
      new ElementAttribute('id', this.id)
    ])
    const ss = document.styleSheets[0];
    const brand = this.renderBrand();
    const toggle = new SideBarToggleButton(this.id).render()
    brand.style.filter = `drop-shadow(3px 2px 2px #00000099)`

    ss.insertRule(`#outer {
      pointer-events: none;
      position: fixed;
      inset: 0 0 auto 0;
    }`, 0)

    ss.insertRule(`#${this.id} {
      background: #22222288;
      display: flex;
      justify-content: space-between;
      margin: .25rem .25rem 0 .25rem;
      padding: .5rem;
      border-radius: .5rem;
    }`, 0 )


    ss.insertRule(`#${this.id} button {
      pointer-events: all;
      border: none;
      display: grid;
      height: 50px;
      width: 50px;
      border-radius: .5rem;
      background: transparent;
      cursor: pointer;
    }`, 0)
    ss.insertRule(`#${this.id} button:hover {
      background: #33333388; 
    }`, 0)

    element.append(brand)
    element.append(toggle)
    outerDiv.append(element)
    document.body.append(outerDiv)
  }
}

class SettingsBar extends Component {
  constructor (parentId, id, settings = []) {
    super(parentId, false)
    this.settings = settings;
    this.id = id;
    this.render()
  }

  render() {
    const ss = document.styleSheets[0]
    const aside = this.createComponent('aside','side-bar', [
      new ElementAttribute('id', this.id)
    ])
    const nav = document.getElementById('outer');
    const selector = document.querySelector('.selector')
    const title = document.createElement('h2')
    title.innerText = 'Settings'
    aside.append(title)

    this.settings.forEach(setting => {
      const { name, defaultValue, minValue, maxValue, step} = setting
      const container = document.createElement('div')
      const label = document.createElement('label')
      const input = document.createElement('input')
      let timer
      label.htmlFor = name;
      label.innerText = name.charAt(0).toUpperCase() + name.slice(1);
      input.name = name;
      input.type = 'range';
      input.step = step;
      input.min = minValue;
      input.max = maxValue;
      input.value = defaultValue;
      input.id = name

      input.addEventListener('input', e => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          App.reInit()
        console.log(e.target.value)
        },500)
      })

      container.append(label, input)
      aside.append(container)
    })

    ss.insertRule(`#${this.id} {
      background: #33333399;
      position: fixed;
      border-radius: .5rem;
      padding: .5rem;
      inset: calc(${nav.getBoundingClientRect().height}px + .25rem) .5rem auto auto;
      transform: translateX(${aside.getBoundingClientRect().width}px);
      
      transition: transform 500ms ease-in;
    }`, 0)


    ss.insertRule(`.active {
      transform: translateX(0) !important;
    }`, 0 )

    ss.insertRule(`aside label {
      position: absolute;
      font-family: "Segoe UI", sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
    }`,0)

    ss.insertRule(`aside input {
      margin-top: 2rem;
      outline: none;
      border: none;
      border-radius: .5rem;
    }`,0)

    ss.insertRule(`aside div {
      margin-top: 3rem;
      position: relative;
    }`,0)

  }
}


class App {

  static sliders = [
    {
      name: 'size',
      defaultValue: 600,
      step: 100,
      maxValue: 1000,
      minValue: 100,
    },
    {
      name: 'gap',
      defaultValue: 2,
      step: 1,
      maxValue: 10,
      minValue: 0,
    },
    {
      name: 'layers',
      defaultValue: 9,
      step: 3,
      maxValue: 100,
      minValue: 3,
    },
    {
      name: 'slices',
      defaultValue: 24,
      step: 3,
      maxValue: 200,
      minValue: 3,
    },
  ]
  static size = 700;
  static gap = 2;
  static layers = 9;
  static slices = 24;
  static id = 'app'
  static colorWheelId = 'main'
  static init() {
    this.element = new ColorWheel('app', 'main', this.size, this.gap, this.layers, this.slices)
    new ColorFormat()
    new NavBar('app', 'nav')
    new SettingsBar('app', 'settings', this.sliders )
  }


  static reInit() {
    const size = document.getElementById('size').value;
    const gap = document.getElementById('gap').value;
    const layers = document.getElementById('layers').value;
    const slices = document.getElementById('slices').value;
    console.log(this.element)
    this.element.rootElement.remove()
    this.element = new ColorWheel(this.id, this.colorWheelId, size, gap, layers, slices)
  }
}

App.init()
