const COLORS = [
  '#FFCDD2',
  '#EF9A9A',
  '#EF5350',
  '#F44336',
  '#D32F2F',
  '#B71C1C',
  '#F8BBD0',
  '#F48FB1',
  '#EC407A',
  '#E91E63',
  '#C2185B',
  '#880E4F',
  '#AA00FF',
  '#E1BEE7',
  '#CE93D8',
  '#AB47BC',
  '#9C27B0',
  '#8E24AA',
  '#7B1FA2',
  '#4A148C',
  '#6200EA',
  '#D1C4E9',
  '#B39DDB',
  '#9575CD',
  '#673AB7',
  '#512DA8',
  '#311B92',
  '#304FFE',
  '#C5CAE9',
  '#7986CB',
  '#5C6BC0',
  '#3F51B5',
  '#303F9F',
  '#1A237E',
  '#2962FF',
  '#BBDEFb',
  '#90CAF9',
  '#42A5F5',
  '#2196F3',
  '#1976D2',
  '#0D47A1',
  '#00B8D4',
  '#18FFFF',
  '#B2EBF2',
  '#80DEEA',
  '#4DD0E1',
  '#00BCD4',
  '#0097A7',
  '#006064',
  '#00BFA5',
  '#1DE9B6',
  '#B2DFDB',
  '#80CBC4',
  '#4DB6AC',
  '#009688',
  '#00796B',
  '#004D40',
  '#00C853',
  '#00E676',
  '#C8E6C9',
  '#A5D6A7',
  '#81C784',
  '#4CAF50',
  '#388E3C',
  '#1B5E20',
  '#64DD17',
  '#B2FF59',
  '#DCEDC8',
  '#C5E1A5',
  '#AED581',
  '#8BC34A',
  '#689F38',
  '#33691E',
  '#AEEA00',
  '#C6FF00',
  '#F0F4C3',
  '#E6EE9C',
  '#DCE775',
  '#CDDC39',
  '#AFB42B',
  '#827717',
  '#FFD600',
  '#FFFF00',
  '#FFF9C4',
  '#FFF59D',
  '#FFF176',
  '#FFEB3B',
  '#FBC02D',
  '#F57F17',
  '#FFAB00',
  '#FFD740',
  '#FFECB3',
  '#FFE082',
  '#FFD54F',
  '#FFC107',
  '#FFA000',
  '#FF6F00',
  '#FF6D00',
  '#FF9100',
  '#FFE0B2',
  '#FFCC80',
  '#FFB74D',
  '#FF9800',
  '#F57C00',
  '#E65100',
  '#DD2C00',
  '#FF3D00',
  '#FFCCBC',
  '#FFAB91',
  '#FF8A65',
  '#FF5722',
  '#E64A19',
  '#BF360C',
  '#D7CCC8',
  '#BCAAA4',
  '#A1887F',
  '#8D6E63',
  '#795548',
  '#5D4037',
  '#4E342E',
  '#3E2723',
  '#FAFAFA',
  '#F5F5F5',
  '#EEEEEE',
  '#E0E0E0',
  '#BDBDBD',
  '#9E9E9E',
  '#757575',
  '#616161',
  '#424242',
  '#212121',
  '#ECEFF1',
  '#CFD8DC',
  '#B0BEC5',
  '#90A4AE',
  '#78909C',
  '#607D8B',
  '#546E7A',
  '#455A64',
  '#37474F',
  '#263238',
]

class ElementAttribute {
  constructor (name, value) {
    this.name = name;
    this.value = value;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createElement(tag, cssClasses, attributes, renderHookId) {
    const rootElement = document.createElement(tag);
    if(cssClasses) {
      rootElement.className = cssClasses;
    }
    if(attributes && attributes.length > 0) {
      attributes.forEach(attribute =>
        rootElement.setAttribute(attribute.name, attribute.value)
      )
    }
    document.getElementById(renderHookId || this.hookId).appendChild(rootElement);
    return rootElement;
  }
}

class iFrameCopier extends Component {
  constructor (renderHookId, className) {
    super(renderHookId, false)
    this.name = className
    this.text = `
      <iframe src="https://nateayye.github.io/color-palette/" 
              sandbox="allow-modals allow-scripts allow-popups allow-same-origin"
              allow="clipboard-read; clipboard-write"
              width="100%"
              height="790px" 
              style="border: 0;">
      </iframe>
    `
    this.render()
  }

  copy = () => {
    const copyBtn = document.querySelector('.iframe-copy-btn')
    const copyBtnText = copyBtn.innerText
    copyBtn.innerText = 'Copied!!'
    setTimeout(() => {
      copyBtn.innerText = copyBtnText
    }, 1000)
    navigator.clipboard.writeText(`${this.text}`)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  render() {
    this.element = this.createElement('pre', 'embed', [
      new ElementAttribute('id', this.name)
    ])
    this.element.innerText = this.text
    this.copyBtn = this.createElement('button', 'iframe-copy-btn', [], this.name)
    this.copyBtn.innerText = 'Copy Me'
    this.copyBtn.addEventListener('click', this.copy)
  }
}

class Color extends Component {
  constructor (renderHookId, color) {
    super(renderHookId, false)
    this.color = color;
    this.render()
  }

  copy = async () => {
    await navigator.clipboard.writeText(this.color)
  }

  render() {
    this.element = this.createElement('div', 'color', [
      new ElementAttribute('id', this.color)
    ], this.hookId)
    this.element.style.backgroundColor = this.color
    this.element.innerHTML = `
      <h3>${this.color}</h3>
      <button class="copyBtn" onclick="this.copy()">
        <svg height="15px" id="Layer_1"  viewBox="0 0 500 500" xml:space="preserve">
          <g>
            <g>
              <path d="M160,160h192c-1.7-20-9.7-35.2-27.9-40.1c-0.4-0.1-0.9-0.3-1.3-0.4c-12-3.4-20.8-7.5-20.8-20.7V78.2    c0-25.5-20.5-46.3-46-46.3c-25.5,0-46,20.7-46,46.3v20.6c0,13.1-8.8,17.2-20.8,20.6c-0.4,0.1-0.9,0.4-1.4,0.5    C169.6,124.8,161.9,140,160,160z M256,64.4c7.6,0,13.8,6.2,13.8,13.8c0,7.7-6.2,13.8-13.8,13.8c-7.6,0-13.8-6.2-13.8-13.8    C242.2,70.6,248.4,64.4,256,64.4z"/>
              <path d="M404.6,63H331v14.5c0,10.6,8.7,18.5,19,18.5h37.2c6.7,0,12.1,5.7,12.4,12.5l0.1,327.2c-0.3,6.4-5.3,11.6-11.5,12.1    l-264.4,0.1c-6.2-0.5-11.1-5.7-11.5-12.1l-0.1-327.3c0.3-6.8,5.9-12.5,12.5-12.5H162c10.3,0,19-7.9,19-18.5V63h-73.6    C92.3,63,80,76.1,80,91.6V452c0,15.5,12.3,28,27.4,28H256h148.6c15.1,0,27.4-12.5,27.4-28V91.6C432,76.1,419.7,63,404.6,63z"/>
            </g>
            <rect height="16" width="112" x="144" y="192"/>
            <rect height="16" width="160" x="144" y="288"/>
            <rect height="16" width="129" x="144" y="384"/>
            <rect height="16" width="176" x="144" y="336"/>
            <rect height="16" width="208" x="144" y="240"/>
          </g>
        </svg>
        COPY!
      </button>
    `;
    this.element.addEventListener('click', async () => {
      await navigator.clipboard.writeText(this.color)
      alert(`Copied ${this.color} to clipboard`)

    })
  }
}

class ColorPalette extends Component {
  colors = []
  constructor (renderHookId, colors) {
    super(renderHookId, false)
    this.render();
    colors.forEach(color => {
      this.colors.push(new Color('palette',color))
    })
  }


  render() {
    this.createElement('div', 'palette', [
      new ElementAttribute('id', 'palette')
    ])
  }
}

class App {
  static init() {
    new ColorPalette('app', COLORS)
    new iFrameCopier('app', 'iframe-copy')
  }
}

App.init()