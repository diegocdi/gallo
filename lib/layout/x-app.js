/**
 * XApp  <x-app></x-app>
 * Controls the workflows and interations between pages and components
 */
customElements.define('x-app', class XApp extends HTMLElement {
  constructor() {
    super();
    this.http = new Http();
    this.pageLoader = new PageLoader();
    this.mainContent = document.querySelector('main');
    this.baseUrl = $CONFIG.baseUrl || '/';
    this.authMethod = $CONFIG.authMethod;    
    this.startPage = $CONFIG.startPage;
  }

  connectedCallback() {
    // AutoRouter using hash links, ex.: #!/app/home or #*/app/home
    window.onpopstate = () => {
      this.go(location.href, location.pathname, false);
    };

    window.onload = () => {
      this.go(location.href, location.pathname, true);
    };

    if (location.href.indexOf('#!') === -1) {
      this.pageLoader.load(this.startPage, this.mainContent);
    }
  }

  /**
   * Executes auth-method must return true/false
   */
  authorize() {
    if (this.authMethod && window[this.authMethod]) {
      return window[this.authMethod]();
    }

    return false;
  }

  /**
   * Load contents
   * @param {string} uri 
   * @param {string} pathname 
   * @param {boolean} reload
   */
  go(uri, pathname, reload) {
    let url = this._getUrl(uri, pathname, reload);
    if (url) {
      // removes / (slash) if url finish with this
      if (url.lastIndexOf('/') === url.length - 1)
        url = url.substring(0, url.lastIndexOf('/'));

      // gives a name to page history
      const title = url.substring(url.lastIndexOf('/') + 1);
      window.history.replaceState(null, title, url);

      this.pageLoader.load(url, this.mainContent);
    }
  }

  /**
    * Navigate to url and load its all contents
    * @param {string} url 
    */
  async _navigateTo(url) {
    await this.pageLoader(url, this.mainContent);    
  }

  /**
   * Returns url to navigate
   * @param {string} uri 
   * @param {string} pathname 
   * @param {boolean} reload
   */
  _getUrl(uri, pathname, reload) {
    let url = uri.indexOf('#*') > -1 ? uri.split('#*')[1] : uri.indexOf('#!') > -1 ? uri.split('#!')[1] : '';
    if (pathname === this.baseUrl && pathname === url)
      url = undefined;

    // private url
    if (uri.indexOf('#!') > -1)
      this.authorize();

    // Navigator back button pressed
    if (!url && !reload) {
      url = pathname;
    }

    return url;
  }
});
