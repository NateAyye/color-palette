// noinspection DuplicatedCode

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
    document.body.append(element)
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

const pieChart = {

  pointConversion: function(xOrigin, yOrigin, radius, angle, gap, index) {
    const x1 = xOrigin + radius * Math.cos(((angle * index) * Math.PI / 180) + gap);
    const y1 = yOrigin + radius * Math.sin(((angle * index ) * Math.PI / 180) + gap) ;
    const x2 = xOrigin + radius * Math.cos(((angle * (index + 1) ) * Math.PI / 180));
    const y2 = yOrigin + radius * Math.sin(((angle * (index + 1) ) * Math.PI / 180));
    return {x1:x1,y1:y1,x2:x2,y2:y2}
  },

  convertToRadian: function(angle) {
    return angle * (Math.PI / 180);
  },

  convertCentralAngle: function(arcLength, radius) {
    return arcLength / radius
  },

  createChart(baseSize, size, thickness, sliceClass, gap, slices, index, layers, backgroundColor) {
    const r = size / 2 - 10;
    const sliceAngle = 360 / slices;
    const w = thickness

    let innerHTML = ``
    let ss = ``

    for (let i = 0; i < slices; i++ ) {
      const outerCircle = this.pointConversion(baseSize / 2,baseSize / 2, r, sliceAngle ,this.convertCentralAngle(gap, r), i)
      const innerCircle = this.pointConversion(baseSize / 2,baseSize / 2, r - w, sliceAngle,this.convertCentralAngle(gap, r), i)
      innerHTML +=  `
        <path 
          id='color-${i}-${r}' 
          class="${sliceClass}"
          d="
            M ${outerCircle.x1} ${outerCircle.y1} 
            A ${r} ${r} 0 0 1 ${outerCircle.x2} ${outerCircle.y2} 
            L ${innerCircle.x2} ${innerCircle.y2} 
            A ${(r * 2 - w) / 2} ${(r * 2 - w) / 2} 0 0 0 ${innerCircle.x1} ${innerCircle.y1} 
            z"  
          stroke="white" 
          stroke-linecap="round" 
          fill='${backgroundColor !== '' ? backgroundColor : `hsl(${(360 / slices) * i} 100% ${10 + ((90 / layers) * index)}%)`}' 
          stroke-width="0"
        />
      `
      const tOriginX = baseSize / 2 + (r - w / 3) * Math.cos(((((sliceAngle * i) + (sliceAngle / 2))) * Math.PI / 180) + (this.convertCentralAngle(gap, r) / 2 ));
      const tOriginY = baseSize / 2 + (r - w / 3) * Math.sin(((((sliceAngle * i) + (sliceAngle / 2))) * Math.PI / 180)  + (this.convertCentralAngle(gap, r) / 2)) ;

      // Origin Test
      // innerHTML += `
      //   <circle cy="${tOriginY}" cx="${tOriginX}" r="2" />
      // `

      ss += `
        #color-${i}-${r} {
          position: absolute;
          transform-origin: ${tOriginX}px ${tOriginY}px;
        }
      `
    }

    return { innerHTML, ss }

  },

  colorWheel: function(size, id, sliceClass,thickness , gap, layers, backgroundColor = '', slices = 12) {
    const pieChart = document.createElement('div')
    pieChart.id = id;
    const ss = document.createElement('style')
    ss.innerHTML += `
      *,
      *::after,
      *::before {
        margin: 0;
        padding: 0;
      }
      
      body {
        background: #22222288;
        min-height: 100vh;
      }
      
      .alert {
        font-size: 20px;
        font-family: "Segoe UI", sans-serif;
        font-weight: 700;
        position: fixed;
        display: grid;
        place-items: center;
        top: 0;
        right:0;
        left: 0;
        height: 3rem;
        background: #00ff80;
        color: white;
        animation: fade-out 2500ms ease-out;
      }
      
      .selector {
        text-align: center;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 3rem;
        background: #a0ffff;
      }
      
      #color-wheel{
        position: absolute;
        top: ${window.innerHeight / 2 - (size / 2)}px;
        left: ${window.innerWidth / 2 - (size / 2)}px;
      }
      path {
        position: relative;
      }
      
      path:hover {
        transform: scale(1.5)
      }
    `

    let innerHTML = ``

    for (let i = 0; i < layers; i++) {
      innerHTML += this.createChart(
        size,
        size - (i * (thickness * 2 + gap)),
        thickness,
        sliceClass,
        gap,
        slices,
        i,
        layers,
        backgroundColor
      ).innerHTML

      ss.innerHTML += this.createChart(size,
        size - (i * (thickness * 2 + gap)),
        thickness,
        sliceClass,
        gap,
        slices,
        i,
        layers,
        backgroundColor
      ).ss
    }

    pieChart.innerHTML = `
      <svg  
        width="${size}"
        height="${size}" 
        viewBox="0 0 ${size} ${size}" 
        xmlns="http://www.w3.org/2000/svg" 
      >
        ${innerHTML}
      </svg>
      `

    document.head.append(ss)
    document.body.append(pieChart)
  }
}



pieChart.colorWheel(
  550,
  'color-wheel',
  'colors',
  25,
  4,
  9,
  '',
  24
)

new ColorFormat()

const colors = document.querySelectorAll('.colors')
colors.forEach(color => {
  color.addEventListener('click', e => {
    const select = document.getElementById('color-space')
    const rgbString = getComputedStyle(color).fill
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
        new Alert('', `Copied!! ${colorFunction}`)
      })
      .catch(err => console.log(err))
  })

  color.addEventListener('mouseover', (ev) => {
    const tempColor = color;
    color.remove()
    document.querySelector('#color-wheel svg ').appendChild(tempColor)
  })
})