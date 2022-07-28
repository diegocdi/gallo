customElements.define('x-actionbar', class XActionbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.style = 'display:none';
    const h = document.querySelector('x-header');
    while(h.children.length > 0)
      h.children[0].remove();

    const title = this.getAttribute('title');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    
    
    div1.style = 'width:50%;float:left;display:flex;';
    div2.style = 'width:50%;float:right;text-align:right;';
    
    div1.innerHTML = `
    <a id="x-nav__open-button" href="javascript:document.querySelector('x-nav').open();">
      <i class="fas fa-bars"></i></a>
      <span class="title">${title}</title>
    </a>`;

    div2.innerHTML = this.innerHTML;

    h.appendChild(div1);
    h.appendChild(div2);
  }
});