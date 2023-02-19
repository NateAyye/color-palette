const theta = [];

const setNav = (main ,set = true) => {
  const colors = document.getElementsByClassName('color')
  const logData = () => {
    for (let i = 0; i < colors.length; i++) {
      console.log(getComputedStyle(colors[i]).left)
    }
  }
  if (set) {
      main.style.transform = 'rotate(30deg) scale(1.4)'
  } else {
      main.style.transform = 'rotate(-30deg) scale(1)'

  }


}

/**
 *
 * @param rows - Must Be Even
 * @param parentId - id of the parent Element
 */
const makeCircularHexGrid = (rows, parentId) => {
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


const setup = function (n, r, id) {
  const main = document.getElementById(id);
  const mainHeight = parseInt(window.getComputedStyle(main).height.slice(0, -2));
  const circleArray = [];
  const colors = ['red', 'orange', 'yellow', 'green', 'blue','indigo', 'purple', 'black', 'maroon', 'grey', 'lightblue', 'tomato', 'pink', 'maroon', 'cyan', 'magenta', 'chocolate', 'darkslateblue', 'coral', 'blueviolet', 'burlywood', 'cornflowerblue', 'crimson', 'darkgoldenrod', 'olive', 'sienna', 'red', 'green', 'purple', 'black', 'orange', 'yellow', 'maroon', 'grey', 'lightblue', 'tomato', 'pink', 'maroon', 'cyan', 'magenta', 'blue', 'chocolate', 'darkslateblue', 'coral', 'blueviolet', 'burlywood', 'cornflowerblue', 'crimson', 'darkgoldenrod', 'olive', 'sienna'];
  for (let i = 0; i < n; i++) {
    const circle = document.createElement('svg');
    circle.setAttribute('viewBox', '0 0 10 10');
    circle.setAttribute('width', '100')
    circle.setAttribute('xmlns','http://www.w3.org/2000/svg')
    circle.setAttribute('fill', colors[i])

    circle.innerHTML = `
      <circle cx="5" cy="5" r="5"></circle>
    `
    let timeout
    const exitBtn = document.getElementById('exit')
    exitBtn.style.position = 'absolute'
    exitBtn.style.right = 10 + 'px';
    exitBtn.style.top = 10 + 'px';
    exitBtn.addEventListener('click', () => {
      const allHexes = document.getElementsByClassName('hex')
      timeout = setTimeout(() => {

      for (let i = 0; i < allHexes.length; i++ ) {
        allHexes[i].style.display = 'none'
      }
      }, 500)
      const outer = document.getElementsByClassName('outer')
      outer[0].style.transform = 'scale(0)'
      setNav(main, false)
      circle.classList.remove('active-color')
    })

    circle.addEventListener('click', () => {
      clearTimeout(timeout)
      const allHexes = document.getElementsByClassName('hex')
      for (let i = 0; i < allHexes.length; i++ ) {
        allHexes[i].style.display = 'inline-block'
      }
      const allCircles = document.getElementsByClassName('color')
      for (let i = 0; i < allCircles.length; i++) {
        allCircles[i].classList.remove('active-color')
      }
      circle.classList.add('active-color')
      const outer = document.getElementsByClassName('outer')
      outer[0].style.transform = 'scale(1)'
      setNav(main)
    })
    circle.className = `color color-${colors[i]}`;
    circleArray.push(circle);
    circleArray[i].posx = Math.round(r * (Math.cos(theta[i]))) + 'px';
    circleArray[i].posy = Math.round(r * (Math.sin(theta[i]))) + 'px';
    circleArray[i].style.position = "absolute";
    circleArray[i].style.backgroundColor = colors[i];
    circleArray[i].style.top = ((mainHeight / 2.31) - parseInt(circleArray[i].posy.slice(0, -2))) + 'px';
    circleArray[i].style.left = ((mainHeight/ 2.31 ) + parseInt(circleArray[i].posx.slice(0, -2))) + 'px';
    main.appendChild(circleArray[i]);
  }
};

const generate = function(n, r, id) {
  const frags = 360 / n;
  for (let i = 0; i <= n; i++) {
    theta.push((frags / 180) * i * Math.PI);
  }
  setup(n, r, id)
}

const palette = document.getElementById('palette')


generate(6, 150, 'palette');
makeCircularHexGrid(5, 'hex-grid')

