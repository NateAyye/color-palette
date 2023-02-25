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
    this.ss = document.styleSheets[0];
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
    this.currColorPickerRadius = (this.size * .035)
    this.thickness = ((this.radius * .9) - (gap * layers)) / layers;
    this.render();
    this.createColorPicker();
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

  createColorPicker() {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('id', 'color-picker')
    circle.setAttribute('cy' , `${this.size / 2}`);
    circle.setAttribute('cx' , `${this.size / 2}`);
    circle.setAttribute('r' , `${this.currColorPickerRadius}`);
    circle.setAttribute('fill', 'white')
    circle.setAttribute('stroke', 'gray')
    circle.setAttribute('stroke-width', '2')
    this.svg.append(circle)
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
      A ${(radius - this.thickness)} ${(radius - this.thickness)} 0 0 0 ${innerLine.x1} ${innerLine.y1}
      z 
    `)
    path.setAttribute('stroke', 'white');
    path.setAttribute('fill', `hsl(${(360 / this.slices) * index} 100% ${5 + ((95 / this.layers) * layer)}%)`)
    path.setAttribute('stroke-width', '0')
    path.style.transformOrigin = `${tOriginX}px ${tOriginY}px`

    path.addEventListener('mouseover', ev => {
      const colorPicker = document.getElementById('color-picker')
      colorPicker.setAttribute('fill', ev.target.getAttribute('fill'))

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

      const tetradicDegrees = 85
      const fluff = ['hsl','(', ')']
      const originalHue = path.getAttribute('fill');
      let hue = path.getAttribute('fill');
      fluff.forEach(string => {hue = hue.replace(string, '')})
      const hslArray = hue.split(' ')
      const hueValue = hslArray[0]
      const oppositeHue = Math.abs(hueValue - (360 / 2) < 0 ? 360 - Math.abs(hueValue - (360 / 2)) : (hueValue - (360 / 2)))
      const thirdHue = Math.abs(oppositeHue - tetradicDegrees < 0 ? 360 - Math.abs(oppositeHue - tetradicDegrees) : oppositeHue - tetradicDegrees)
      const fourthHue = Math.abs(oppositeHue + tetradicDegrees > 360 ? (oppositeHue + tetradicDegrees) - 360 : oppositeHue + tetradicDegrees)
      const thirdHslString = `hsl(${thirdHue} ${hslArray[1]} ${hslArray[2]})`
      const fourthHslString =  `hsl(${fourthHue} ${hslArray[1]} ${hslArray[2]})`
      const oppositeHslString = `hsl(${oppositeHue} ${hslArray[1]} ${hslArray[2]})`
      const hslStringArray = [
        originalHue,
        oppositeHslString,
        thirdHslString,
        fourthHslString
      ]

      const combinationColors = document.querySelectorAll('svg:has(>rect)')
      combinationColors.forEach((color, i) => {
        const rect = color.querySelector('rect')
        const hexValueElement = color.previousSibling
        hexValueElement.innerHTML = ColorHelper.CssHSLToHex(hslStringArray[i])
        rect.setAttribute('fill', hslStringArray[i])
      })


      // const testDiv = document.createElement('div')
      // testDiv.style.height = 20 + 'px';
      // testDiv.style.width = 20 + 'px';
      // testDiv.style.background = oppositeHslString;
      //
      // document.body.append(testDiv)

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
      transform: scale(2);
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

  renderSelector() {
    const element = document.createElement('div')
    element.id = 'select'
    element.style.display = 'flex';
    element.style.flexDirection = 'column'
    element.style.justifyContent = 'center'
    element.innerHTML = `
      <h3>Color Format</h3>
      <select name="color" id="color-space">
        <option>HEX</option>
        <option>HSL</option>
        <option>RGB</option>
      </select>
    `
    document.styleSheets[0].insertRule(`#nav #select h3 {
      font-family: inherit;
      background: #444444cc;
      color: white;
      padding: 0 .5rem;
      border-radius: .25rem;  
      margin-bottom: .25rem;    
    }`,0)
    return element
  }

  renderBrand() {
    const brandSvg = this.createSVG(100, 50, 'brand')

    this.ss.insertRule(`.cls-1 {
        fill: aqua;
    }`, 0)
    this.ss.insertRule(`.cls-2 {
        fill: #662d91;
    }`, 0)
    this.ss.insertRule(`.cls-3 {
       fill: lime;
    }`, 0)
    this.ss.insertRule(`.cls-4 {
       fill: #f0f;
    }`, 0)
    this.ss.insertRule(`.cls-5 {
       fill: red;
    }`, 0)
    this.ss.insertRule(`.cls-6 {
       fill: #ff0;
    }
    `,0)
    brandSvg. innerHTML = `
      <g id="Layer_1-2">
        <g>
          <path d="m0,35.23V0h7.38l9.8,28.48c-.1-1.03-.19-2.24-.29-3.64-.1-1.4-.19-2.82-.27-4.27-.08-1.45-.12-2.73-.12-3.86V0h5.5v35.23h-7.38L4.92,6.76c.06.93.14,2.06.24,3.38.1,1.32.18,2.67.24,4.05.06,1.38.1,2.65.1,3.81v17.23H0Z"/>
          <path d="m29.5,19.44c-1.18,0-2.1-.33-2.78-1s-1.02-1.54-1.02-2.62.39-2.01,1.16-2.68c.77-.67,1.83-1,3.17-1h2.81v-.82c0-1.16-.68-1.74-2.04-1.74-.62,0-1.11.12-1.47.36-.36.24-.57.57-.61,1.01h-2.52c.06-1.04.49-1.88,1.31-2.52.82-.64,1.92-.97,3.31-.97,1.47,0,2.61.34,3.42,1.03.81.69,1.22,1.65,1.22,2.9v7.83h-2.56v-2.16c-.1.74-.45,1.32-1.05,1.74-.6.42-1.39.63-2.35.63Zm.84-2.14c.77,0,1.38-.19,1.83-.57.45-.38.67-.88.67-1.51v-1.37h-2.69c-.57,0-1.03.16-1.36.48s-.5.73-.5,1.24.18.93.54,1.25c.36.31.86.47,1.52.47Z"/>
          <path d="m44.54,19.23c-1.08,0-1.94-.31-2.57-.93s-.96-1.47-.96-2.53v-5.71h-3.19v-2.37h3.19v-3.25h2.65v3.25h4.6v2.37h-4.6v5.65c0,.34.09.61.28.83s.45.33.79.33h3.42v2.37h-3.61Z"/>
          <path d="m56,19.44c-.98,0-1.83-.19-2.56-.57-.73-.38-1.29-.91-1.69-1.61-.4-.69-.6-1.51-.6-2.45v-2.73c0-.94.2-1.75.6-2.45.4-.69.96-1.23,1.69-1.61s1.58-.57,2.56-.57,1.81.19,2.53.57c.72.38,1.28.91,1.68,1.59.4.68.6,1.47.6,2.38v2.1h-7.14v.8c0,.78.2,1.38.61,1.77.41.4.98.6,1.72.6.55,0,1.01-.09,1.4-.28.38-.19.61-.47.68-.83h2.6c-.18.99-.7,1.79-1.55,2.38-.85.6-1.9.89-3.13.89Zm-2.33-7.43v.4l4.62-.02v-.4c0-.8-.2-1.41-.59-1.85-.39-.43-.96-.65-1.7-.65s-1.35.22-1.74.66c-.39.44-.59,1.06-.59,1.86Z"/>
          <path d="m61.88,10.31l1.13-2.6c.11-.25.21-.52.28-.82.08-.29.12-.55.12-.76,0-.42-.1-.83-.3-1.24s-.49-.74-.87-.99h2.73c.34.25.6.58.79,1,.19.41.28.82.28,1.23,0,.28-.05.62-.16,1.01-.11.39-.23.75-.37,1.07l-.92,2.1h-2.71Z"/>
          <path d="m71.21,19.42c-1.37,0-2.46-.31-3.26-.93-.8-.62-1.2-1.47-1.2-2.53h2.58c0,.45.16.79.49,1.03s.79.36,1.38.36h.92c.63,0,1.12-.12,1.46-.36s.51-.58.51-1.03c0-.42-.12-.73-.36-.93-.24-.2-.6-.34-1.09-.41l-2.88-.38c-.92-.13-1.63-.48-2.13-1.07-.5-.59-.75-1.35-.75-2.29,0-1.09.36-1.93,1.09-2.51.73-.58,1.78-.87,3.15-.87h.97c1.29,0,2.32.29,3.11.88.78.59,1.19,1.37,1.22,2.35h-2.6c-.01-.36-.18-.65-.48-.87-.31-.22-.72-.33-1.24-.33h-.97c-.56,0-.99.12-1.28.35s-.44.54-.44.93c0,.35.11.61.33.78s.54.27.96.31l2.71.38c1.06.13,1.87.5,2.4,1.12.54.62.81,1.46.81,2.51,0,1.12-.38,1.98-1.14,2.59-.76.61-1.88.91-3.35.91h-.92Z"/>
        </g>
        <g>
          <path d="m23.56,48.53v-27.74h9.23c1.85,0,3.46.36,4.84,1.06,1.38.71,2.45,1.7,3.21,2.98.76,1.28,1.14,2.78,1.14,4.5s-.38,3.22-1.14,4.5c-.76,1.28-1.83,2.27-3.21,2.98-1.38.71-3,1.06-4.84,1.06h-4.48v10.64h-4.75Zm4.75-14.82h4.48c1.34,0,2.41-.4,3.19-1.22.79-.81,1.18-1.86,1.18-3.15s-.39-2.34-1.18-3.15-1.85-1.22-3.19-1.22h-4.48v8.74Z"/>
          <path class="cls-5" d="m43.25,45.67c-.78,0-1.4-.22-1.85-.67-.45-.44-.68-1.02-.68-1.74s.26-1.34.77-1.79c.51-.44,1.22-.67,2.11-.67h1.88v-.55c0-.78-.45-1.16-1.36-1.16-.41,0-.74.08-.98.24-.24.16-.38.38-.41.67h-1.68c.04-.69.33-1.25.88-1.68.55-.43,1.28-.64,2.2-.64.98,0,1.74.23,2.28.69.54.46.81,1.1.81,1.93v5.22h-1.71v-1.44c-.07.5-.3.88-.7,1.16-.4.28-.92.42-1.57.42Zm.56-1.43c.51,0,.92-.13,1.22-.38s.45-.59.45-1.01v-.91h-1.79c-.38,0-.69.11-.91.32s-.34.49-.34.83.12.62.36.83c.24.21.58.31,1.02.31Z"/>
          <path class="cls-6" d="m52.09,45.53c-.77,0-1.38-.23-1.84-.69-.46-.46-.69-1.06-.69-1.81v-9.15h-2.53v-1.58h4.28v10.69c0,.29.08.52.25.69.16.17.38.26.67.26h2.25v1.58h-2.38Z"/>
          <path class="cls-3" d="m58.59,45.67c-.65,0-1.22-.13-1.71-.38s-.86-.61-1.13-1.07c-.27-.46-.4-1.01-.4-1.63v-1.82c0-.62.13-1.17.4-1.63s.64-.82,1.13-1.07,1.05-.38,1.71-.38,1.21.13,1.69.38c.48.25.85.6,1.12,1.06.27.45.4.98.4,1.59v1.4h-4.76v.53c0,.52.13.92.41,1.18.27.27.65.4,1.15.4.36,0,.67-.06.93-.19.26-.13.41-.31.46-.55h1.74c-.12.66-.47,1.19-1.04,1.59s-1.26.59-2.09.59Zm-1.55-4.96v.27h3.08v-.28c0-.53-.13-.94-.39-1.23-.26-.29-.64-.43-1.13-.43s-.9.15-1.16.44c-.26.29-.39.71-.39,1.24Z"/>
          <path class="cls-1" d="m67.08,45.53c-.72,0-1.29-.21-1.71-.62s-.64-.98-.64-1.69v-3.81h-2.13v-1.58h2.13v-5.17h1.76v5.17h3.07v1.58h-3.07v3.77c0,.22.06.41.19.55s.3.22.52.22h2.28v1.58h-2.41Z"/>
          <path class="cls-4" d="m74.81,45.53c-.72,0-1.29-.21-1.71-.62s-.64-.98-.64-1.69v-3.81h-2.13v-1.58h2.13v-3.6h1.76v3.6h3.07v1.58h-3.07v3.77c0,.22.06.41.19.55s.3.22.52.22h2.28v1.58h-2.41Z"/>
          <path class="cls-2" d="m80.79,45.67c-.65,0-1.22-.13-1.71-.38s-.86-.61-1.13-1.07c-.27-.46-.4-1.01-.4-1.63v-1.82c0-.62.13-1.17.4-1.63s.64-.82,1.13-1.07,1.05-.38,1.71-.38,1.21.13,1.69.38c.48.25.85.6,1.12,1.06.27.45.4.98.4,1.59v1.4h-4.76v.53c0,.52.13.92.41,1.18.27.27.65.4,1.15.4.36,0,.67-.06.93-.19.26-.13.41-.31.46-.55h1.74c-.12.66-.47,1.19-1.04,1.59s-1.26.59-2.09.59Zm-1.55-4.96v.27h3.08v-.28c0-.53-.13-.94-.39-1.23-.26-.29-.64-.43-1.13-.43s-.9.15-1.16.44c-.26.29-.39.71-.39,1.24Z"/>
        </g>
      </g>
    `
    return brandSvg
  }

  render() {
    const outerDiv = document.createElement('div')
    outerDiv.id = 'outer'
    const element = this.createComponent('div','navbar', [
      new ElementAttribute('id', this.id)
    ])
    const ss = document.styleSheets[0];
    const brand = this.renderBrand();
    const selector = this.renderSelector()
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
      align-items: center;
      margin: .25rem .25rem 0 .25rem;
      padding: .5rem;
      border-radius: .5rem;
    }`, 0 )

    ss.insertRule(`#${this.id} select {
      pointer-events: all;
      text-align: center;
      margin: auto;
      cursor: pointer;
    }`, 0)

    ss.insertRule(`#${this.id} button {
      pointer-events: all;
      border: none;
      display: grid;
      height: 50px;
      width: 50px;
      border-radius: .5rem;
      background: transparent;
      cursor: pointer;
      margin-left: 50px;
    }`, 0)
    ss.insertRule(`#${this.id} button:hover {
      background: #33333388; 
    }`, 0)

    element.append(brand)
    element.append(selector)
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
      label.innerText = `${ name.charAt(0).toUpperCase() + name.slice(1)}: ${defaultValue}`;
      input.name = name;
      input.type = 'range';
      input.step = step;
      input.min = minValue;
      input.max = maxValue;
      input.value = defaultValue;
      input.id = name

      input.addEventListener('input', e => {
        label.innerText = `${ name.charAt(0).toUpperCase() + name.slice(1)}: ${e.target.value}`;
        clearTimeout(timer)
        timer = setTimeout(() => {
          App.reInit()
        },500)
      })

      container.append(label, input)
      aside.append(container)
    })

    ss.insertRule(`#${this.id} {
      text-align: center;
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

class TetradicPalette extends Component{
  constructor (parentId, id) {
    super(parentId,false);
    this.ss = document.styleSheets[0];
    this.id = id;
    this.render()
  }

  render() {
    const element = this.createComponent('div', 'simple-palette', [
      new ElementAttribute('id', this.id)
    ])

    this.ss.insertRule(`#${this.id} {
      position: fixed;
      inset: auto 0 0 0;
      display: flex;
      text-align: center;
      justify-content: center;
      gap: 1rem;
      background: #555555ee;
    }`, 0)

    this.ss.insertRule(`#${this.id} h4 {
      font-family: "Segoe UI", sans-serif;
      font-weight: 700;
    }`,0)

    for (let i = 0; i < 4; i++ ){
      const colorContainer = document.createElement('div')
      const mainColor = this.createSVG(80, 30, `combination-color-${i}`)
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      const hexString = document.createElement('h4')


      hexString.innerText = `#ffffff`.toUpperCase()
      rect.setAttribute('width', '80');
      rect.setAttribute('height', '30');
      rect.setAttribute('fill', 'white')
      rect.setAttribute('rx', '10')
      mainColor.setAttribute('fill', 'red')



      mainColor.append(rect);
      colorContainer.append(hexString)
      colorContainer.append(mainColor);
      element.append(colorContainer)
    }
  }
}

class App {

  static sliders = [
    {
      name: 'size',
      defaultValue: 700,
      step: 100,
      maxValue: 1000,
      minValue: 100,
    },
    {
      name: 'gap',
      defaultValue: 1,
      step: 1,
      maxValue: 5,
      minValue: 0,
    },
    {
      name: 'layers',
      defaultValue: 20,
      step: 3,
      maxValue: 100,
      minValue: 3,
    },
    {
      name: 'slices',
      defaultValue: 48,
      step: 3,
      maxValue: 360 / 2,
      minValue: 3,
    },
  ]
  static size = 700;
  static gap = 1;
  static layers = 20;
  static slices = 48;
  static id = 'app'
  static colorWheelId = 'main'
  static init() {
    this.element = new ColorWheel('app', 'main', this.size, this.gap, this.layers, this.slices)
    // new ColorFormat()
    new NavBar('app', 'nav')
    new SettingsBar('app', 'settings', this.sliders )
    new TetradicPalette('app','tetradic')
  }


  static reInit() {
    const size = document.getElementById('size').value;
    const gap = document.getElementById('gap').value;
    const layers = document.getElementById('layers').value;
    const slices = document.getElementById('slices').value;
    this.element.rootElement.remove()
    this.element = new ColorWheel(this.id, this.colorWheelId, size, gap, layers, slices)
  }
}

App.init()
