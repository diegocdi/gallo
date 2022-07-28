/**
 * XImgAvatar  <x-img-avatar></x-img-avatar>
 * Creates a avatar with photo or first letter
 */
customElements.define('x-img-avatar', class XImgAvatar extends HTMLElement {
  constructor() {
    super();
    this.img = undefined;
    this._b64 = undefined;
    this._text = undefined;
  }

  static get observedAttributes() {
    return ['b64', 'text'];
  }

  get b64() {
    return this._b64;
  }

  set b64(val) {
    this._b64 = val;
  }

  get text() {
    return this._text;
  }

  set text(val) {
    this._text = val;
  }

  connectedCallback() {
    if (!this.querySelector('img')) {
      this.img = document.createElement('img');
      this.img.width = this.getAttribute('width');
      this.img.height = this.getAttribute('height');
      this.appendChild(this.img);
      this.render();
    }
  }

  render() {
    this.img.style = "border-radius: 50%;margin:0px;padding:0px";
    this._b64 = this.getAttribute('b64');
    this._text = this.getAttribute('text');

    if (this._b64 && this._b64.length > 100) {
      this.setAttribute('src', `data:image/jpeg;base64,${this._b64}`);
    } else if (this._text) {
      const letter = ['?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U','V', 'X', 'Y', 'Z', 'W'];
      const colors = ['#000', '#1abc9c', '#16a085', '#f1c40f', '#f39c12', '#2ecc71', '#27ae60', '#e67e22', '#d35400', '#3498db', '#2980b9', '#e74c3c', '#c0392b', '#9b59b6', '#8e44ad', '#bdc3c7', '#34495e', '#2c3e50', '#95a5a6', '#7f8c8d', '#ec87bf', '#d870ad', '#f69785', '#9ba37e', '#b49255', '#b49255', '#a94136'];
      let pos = (this._text.length > 0) ? letter.indexOf(this._text.toUpperCase()[0]) : 0;
      const ctner = document.createElement('div');
      ctner.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" pointer-events="none" width="32px" height="32px" style="background:${colors[pos]};color:#fff;width:32px;height:32px;border-radius:50%;font-family:\'Helvetica Neue\',\'Helvetica\',\'RobotoRegular\',\'Droid Sans\',\'Segoe UI\',Segoe,Tahoma,Geneva,sans-serif">
                <text text-anchor="middle" y="50%" x="50%" dy="0.35em" pointer-events="auto" fill="#fff" style="font-size:18px">${letter[pos]}</text>'
            </svg>`;
      const aux64 = window.btoa(ctner.innerHTML);
      this.img.setAttribute('src', `data:image/svg+xml;base64,${aux64}`);
    }
  }
});