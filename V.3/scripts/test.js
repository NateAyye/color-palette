

const Position = {
  /**
   *
   * @param n - number of divs
   * @param rx - radius along X-axis
   * @param ry - radius along Y-axis
   * @param so - startOffset
   * @param wh - width/height of divs
   * @param idd - id of main div(ellipse)
   * @param cls - className of divs
   * @param cw - clockwise(true/false)
   */
  ellipse : function(n, rx, ry, so, wh, idd, cls, cw) {
    let m = document.createElement('div'), ss = document.styleSheets;
    ss[0].insertRule(`#${idd} { 
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.2);
      width: ${String((rx * 2) + wh)}px;
      height: ${String((ry * 2) + wh)}px; 
    }`, 1)

    ss[0].insertRule(`.${cls} {
     position: absolute;
     background: black;
     color: papayawhip;
     text-align: center;
     font-family: "Open Sans Condensed", sans-serif;
     border-radius: 50%;
     transition: transform 0.2s ease;
     width: ${wh}px;
     height: ${wh}px;
     line-height: ${wh}px;
    }`, 1)

    ss[0].insertRule(`.${cls}:hover {
      transform: scale(1.2);
      cursor: pointer;
      background: rgba(0, 0, 0, 0.8);
    }`, 1)

    m.id = idd;
    for (let i = 0; i < n; i++) {
      let c = document.createElement('div');
      c.className = cls;
      c.innerHTML = i + 1;
      c.style.top = String(ry + -ry * Math.cos((360 / n / 180) * (i + so) * Math.PI)) + 'px';
      c.style.left = String(rx + rx * (cw ? Math.sin((360 / n / 180) * (i + so) * Math.PI) : -Math.sin((360 / n / 180) * (i + so) * Math.PI))) + 'px';
      m.appendChild(c);
    }
    document.body.appendChild(m);
  }
}

Position.ellipse(10, 150, 150, 0, 35, 'palette-test', 'color-test', true);