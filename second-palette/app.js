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

  convertCentralAngle: function(arcLength, radius) {
    return arcLength / radius
  },

  /**
   *
   * @param bS The x and y diameter of the outside pie Chart.
   * @param cS The current Size of the pieChart ( used in recursion when layers > 1 )
   * @param w The thickness of each layer in pixels
   * @param sC the css class for each individual layerSlice ( format for id : 'color-(layerIndex)-(currentRadius)')
   * @param g the gap in between each slice and layer
   * @param n how many slices the circle be split into.
   * @param ind The current layer of the Circle (Used For Recursion).
   * @param l How many layers will the pie chart go down.
   * @param c Background Color of all the slices/layers, default if the colorWheel.
   * @param sW
   * @param o
   * @returns {{ss: string, innerHTML: string}} ss - the style Sheet needed for the paths , the innerHTML is all the paths in a string template.
   *
   */
  createChart(bS, cS, w, sC, g, n, ind, l, c, sW, o) {
    const r = cS / 2 - 10, sliceAngle = 360 / n;
    let innerHTML = ``, ss = ``;

    for (let i = 0; i < n; i++ ) {

      const outerCircle = this.pointConversion(bS / 2,bS / 2, r, sliceAngle ,this.convertCentralAngle(g, r), i)
      const innerCircle = this.pointConversion(bS / 2,bS / 2, r - w, sliceAngle,this.convertCentralAngle(g, r), i)
      const tOriginX = bS / 2 + (r - w / 3) * Math.cos(((((sliceAngle * i) + (sliceAngle / 2))) * Math.PI / 180) + (this.convertCentralAngle(g, r) / 2 ));
      const tOriginY = bS / 2 + (r - w / 3) * Math.sin(((((sliceAngle * i) + (sliceAngle / 2))) * Math.PI / 180)  + (this.convertCentralAngle(g, r) / 2)) ;
      innerHTML +=  `
        <path 
          id='color-${i + 1}-${r}' 
          class="${sC}"
          data-circle-id="circle-${i + 1}-${r}"
          d="
            M ${outerCircle.x1} ${outerCircle.y1} 
            A ${r} ${r} 0 0 1 ${outerCircle.x2} ${outerCircle.y2} 
            L ${innerCircle.x2} ${innerCircle.y2} 
            A ${(r * 2 - w) / 2} ${(r * 2 - w) / 2} 0 0 0 ${innerCircle.x1} ${innerCircle.y1} 
            z"  
          stroke="white" 
          stroke-linecap="round" 
          fill='${c !== '' ? c : `hsl(${(360 / n) * i} 100% ${10 + ((90 / l) * ind)}%)`}' 
          stroke-width="${sW}"
        />
        ${o ? `<circle id='circle-${i + 1}-${r}' cy="${tOriginY}" cx="${tOriginX}" r="2" fill="black" />` : ''}
      `

      ss += `
        #color-${i + 1}-${r} {
          position: absolute;
          transform-origin: ${tOriginX}px ${tOriginY}px;
        }
      `
    }

    return { innerHTML, ss }

  },

  colorWheel: function(s, id, sliceClass,thickness , gap, layers, strokeWidth = 0, backgroundColor = '', slices = 12, showOrigin = false) {
    const pieChart = document.createElement('div')
    pieChart.id = id;
    const r = s / 2
    thickness = ((r * .9) - (gap * layers)) / layers
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
        display: grid;
        place-items: center;
        overflow: hidden;
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
      
      path {
        position: relative;
      }
      
      path:hover {
        transform: scale(1.5)
      }
    `

    let innerHTML = ``

    for (let i = 0; i < layers; i++) {
      const thicknessHolder = thickness
      if ( i + 1 === layers ) {
        thickness = (s - (i * (thicknessHolder * 2 + (gap * 2)))) / 2 * 0.5;
      }
      innerHTML += this.createChart(
        s,
        s - (i * (thicknessHolder * 2 + (gap * 2))),
        thickness,
        sliceClass,
        gap,
        slices,
        i,
        layers,
        backgroundColor,
        strokeWidth,
        showOrigin
      ).innerHTML

      ss.innerHTML += this.createChart(
        s,
        s - (i * (thicknessHolder * 2 + (gap * 2))),
        thickness,
        sliceClass,
        gap,
        slices,
        i,
        layers,
        backgroundColor,
        strokeWidth,
        showOrigin
      ).ss
    }

    pieChart.innerHTML = `
      <svg  
        width="${s}"
        height="${s}" 
        viewBox="0 0 ${s} ${s}" 
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
  600,
  'color-wheel',
  'colors',
  20,
  4,
  9,
  1,
  '',
  24,
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
    const tempCircle = document.getElementById(color.getAttribute('data-circle-id'))
    const tempColor = color;
    if (tempCircle) {
      document.getElementById(color.getAttribute('data-circle-id')).remove()
      document.querySelector('#color-wheel svg ').appendChild(tempCircle)
    }
    color.remove()
    document.querySelector('#color-wheel svg ').appendChild(tempColor)
  })
})
