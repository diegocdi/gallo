customElements.define('x-dropdown', class XDropdown extends HTMLElement {
  constructor() {
    super();
    this._showing = false;
    this._upgraded = false;
    this._trigger = '';
  }

  connectedCallback() {
    if (!this._upgraded) {
      this._upgraded = true;
      this.render();
    }
  }

  render() {
    this._trigger = this.getAttribute('trigger');
    document.getElementById(this._trigger).addEventListener('click', (e) => {
      e.stopPropagation();
      if (!this._showing)
        this.show(e.clientY, e.clientX);
    });
  }

  show(top, left) {
    this._showing = true;
    this.style.display = 'table';
    const width = this.getAttribute('width') ? this.getAttribute('width') : 200;
    const height = this.offsetHeight;
    const fct = (e) => {
      if ((e.type === 'keydown' && e.keyCode === 27) || (e.type === 'click')) {
        this.style.display = 'none';
        document.body.removeEventListener('click', fct);
        document.body.removeEventListener('keydown', fct);
        this._showing = false;
      }
    };

    if (height + top > document.body.offsetHeight)
      top = document.body.offsetHeight - height;

    if (width + left > document.body.offsetWidth)
      left = document.body.offsetWidth - width - 10;

    let elem = this;
    while (elem = elem.offsetParent) {
      if (elem.tagName.toLowerCase() === 'x-header' && document.body.offsetWidth >= 1000) {
        left = left - 210;
        top = top + 20;
        break;
      }
    }

    this.setAttribute('style', `width:${width};left:${left}px;top:${top}px;display:table;`);
    document.body.addEventListener('click', fct);
    document.body.addEventListener('keydown', fct);
  }
});