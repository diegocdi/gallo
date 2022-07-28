customElements.define('x-nav', class XNav extends HTMLElement {
  constructor() {
    super();
    this.fct = (e) => {
      if ((e.type === 'keydown' && e.keyCode === 27) || (e.type === 'click')) {
        this.close();
        document.body.removeEventListener('click', this.fct);
        document.body.removeEventListener('keydown', this.fct);
      }
    };
  }

  connectedCallback() {
    const a = document.createElement('a');
    a.setAttribute('id', 'x-nav__close-button');
    a.setAttribute('href', `javascript:document.querySelector('x-nav').close();`);
    a.innerHTML = '<i class="fas fa-times"></i>';
    this.insertBefore(a, this.firstChild);    

    // First loop attachs events
    const lis = this.querySelectorAll('li a');
    for(const li of lis) {
      li.addEventListener('click', (evt) => {
        // Second loop removes active attribute
        const ul = evt.target.parentNode.parentNode;
        const lis2 = ul.querySelectorAll('li a');
        for(const li2 of lis2) {
          li2.removeAttribute('active');
        }
        evt.target.setAttribute('active', true);
      });
    }
  }

  open() {
    this.setAttribute('opened', 'true');
    document.body.addEventListener('click', this.fct);
    document.body.addEventListener('keydown', this.fct);
  }

  close() {
    this.removeAttribute('opened');
  }
});