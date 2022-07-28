class XDataGrid extends HTMLTableElement {
  /**
   * Constructor
   */
  constructor() {
    super();
    this._http = new Http();
    this._loader = new Loader();
    this._pageSize = this.getAttribute('pagging');
    this._tbody = this.querySelector('tbody');
    this._template = this._tbody.children[0].innerHTML;
    this._data = [];
    this._isLoading = false;
  }

  /**
   * connectedCallback 
   */
  connectedCallback() {
    if (!this.getAttribute('upgraded')) {      
      this.setAttribute('upgraded','true');         
      this._setupInfiniteScroll();      
      this.loadData();
    } 
  }

  /**
   * Sets search url.
   * Ex.: '/endpoint?filter=xyz&pageStart=0&pageEnd=100';
   * @param {string} url 
   * @returns {XDataGrid} returns itself
   */
  setSearchUrl(url) {
    this.setAttribute('search-url', url);
    return this;
  }
  
  /**
   * getSearchUrl
   * @returns {string}
   */
  getSearchUrl() {
    let url = this.getAttribute('search-url') || '';
    url = url.replace('[SKIP]', this.getAttribute('page-start'));
    url = url.replace('[LIMIT]', this._pageSize);
    return url;
  }

  /**
   * Reset grid
   */
  clear() {
    this._data = [];
    this.setAttribute('page-start', '0');
    this.setAttribute('page-end', this._pageSize);
    while (this._tbody.children.length > 1)
      this._tbody.removeChild(this._tbody.children[1]);
  }

  /**
   * Set pagging to next page
   * page-start becames page-end
   * page-end becames page-end + page-size + 1
   */
  nextPage() {
    const pgStart = parseInt(this.getAttribute('page-end')) + 1
    const pgEnd = parseInt(this.getAttribute('page-end')) + parseInt(this._pageSize);
    this.setAttribute('page-start', pgStart.toString());
    this.setAttribute('page-end', pgEnd.toString());
  }

  async loadData(isPagging = false) {
    this._isLoading = true;    
    this._loader.show();
    if (!isPagging) {
      this.clear();
    } else {
      this.nextPage();
    }
        
    const url = this.getSearchUrl();
    const list = await this._http.get(url);
    this._data = this._data.concat(list);
    this._loader.hide();
    
    const fragment = document.createDocumentFragment();
    
    for (const model of list) {    
      const tds = eval('`' + this._template + '`');
      const tr = document.createElement('tr');
      tr.innerHTML = tds;
      fragment.appendChild(tr);
    }    
    this._tbody.appendChild(fragment);
    this._isLoading = false;    
  }  

  /**
  * setup the infinit scroll
  */
  _setupInfiniteScroll() {
    const sc = this.getAttribute('scroll-container');
    const ctner = document.getElementById(sc) || null;

    if (ctner) {  
      ctner.addEventListener('scroll', () => {
        if (!this._isLoading) {
          const lastRow = this._tbody.children[this._tbody.children.length - 1];
          const offHeight = ctner.offsetTop + ctner.offsetHeight;
          const offPos = lastRow.getBoundingClientRect().top + lastRow.getBoundingClientRect().height;

          if (offHeight + 150 > offPos) {
            this.loadData(true);
          }
        }
      });      
    }
  }
}

customElements.define('x-data-grid', XDataGrid, { extends: "table" });

