customElements.define('x-progress-bar', class XProgressBar extends HTMLElement {
  constructor() {
    super();
    this._percent = this.getAttribute('percent') + '%' || '0%';
    this._height = this.getAttribute('height') || 10;
  }

  get percent() {
    return this._percent;
  }

  set percent(val) {
    this._percent = ((val + '').indexOf('%') === -1) ? val + '%' : val;
    this.render();
  }

  get height() {
    return this._height;
  }

  set height(val) {
    this._height = val;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.style = `
      width: 100%;       
      padding: 0px; 
      display:table; 
      border: var(--x-progress-bar-border);        
      background: var(--x-progress-bar-background);`;

    let div = document.createElement('div');
    if (this.children.length === 0) {      
      div.style = `
        transition: width 1s;
        display:table;
        width: ${this._percent};        
        height: ${this._height}px;
        background-color: var(--x-progress-bar-foreground);        
      `;
      this.appendChild(div);
    } else {
      div = this.children[0];
      div.style.width = this._percent;
    }
  }
});