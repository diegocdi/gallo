customElements.define('x-content-loader', class XContentLoader extends HTMLElement {
  constructor() {
    super();
    this.pageLoader = new PageLoader();
    this.url = this.getAttribute('url');
  }

  connectedCallback() {
    this.pageLoader.load(this.url, this);
  }
});


