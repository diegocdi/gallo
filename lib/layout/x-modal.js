customElements.define('x-modal', class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const w = this.getAttribute('width') || '90%';
    const h = this.getAttribute('height') || '90%';
    const content = this.querySelector('x-modal-content');
    content.setAttribute('style', `width:100%;height:${screen.availHeight-200}px;max-width:${w};max-height:${h}`);
  }

  open() {
    this.setAttribute('opened', '');
  }

  close() {
    this.removeAttribute('opened');
  }
});