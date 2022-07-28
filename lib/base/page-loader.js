/**
 * PageLoader
 * Loads HTML and dependencies
 */
 class PageLoader {
  constructor() {
    this.http = new Http();
    this.headSection = document.querySelector('head');
  }

  /**
   * 
   * @param {string} url path html file
   * @param {any} container HtmlElement
   */
  async load(url, container) {
    // Clear container
    while (container.children.length > 0)
      container.removeChild(container.children[0]);

    // Fetch and cache html contents into template object
    let temp = document.createElement('template');
    const id = url.split('/').join('-');
    if (!document.querySelector(`#html${id}`)) {
      temp.innerHTML = await this.http.getHtml(url);
      const page = temp.content.querySelector('template');
      if (page) {        
        // Render webcomponents
        this._renderWebComponents(page);
        // Render HTML                
        container.appendChild(document.importNode(page.content, true));
        // Load css, js, and all dependencies defined in meta tags
        await this._loadDependencies(url, temp.content.querySelectorAll('meta'));        
        // Store cache
        page.setAttribute('id', `html${id}`);
        document.body.appendChild(page);
      } else {
        console.error('Missing template tag');
      }
    } else {
      temp = document.querySelector(`#html${id}`);
      container.appendChild(document.importNode(temp.content, true));
    }
  }

  /**
   * Load all metas in html
   * @param {string} url 
   * @param {any} metas tags
   */
  async _loadDependencies(url, metas) {
    for (const meta of metas) {
      const name = meta.getAttribute('name') || '';
      const file = meta.getAttribute('content') || '';
      const id = url.split('/').join('-') + '-' + file.split('/').join('-');
      const styleTag = document.createElement('style');
      const scriptTag = document.createElement('script');
      const jsVar = meta.getAttribute('instance');
      const jsClass = meta.getAttribute('class');
      const h = this.headSection;

      if (!document.getElementById(id)) {
        switch(name) {
          case 'stylesheet':            
            styleTag.setAttribute('id', id);
            styleTag.setAttribute('rel', 'stylesheet');
            styleTag.setAttribute('href', url + '/' + file);
            h.appendChild(styleTag);
            break;

          case 'javascript':      
            scriptTag.setAttribute('id', id);
            scriptTag.innerHTML = await this.http.getHtml(url + '/' + file);            
            scriptTag.src = url + '/' + file;            
            scriptTag.onload = () => {
              // Creates a global instance
              const declaration = document.createElement('script');
              declaration.innerHTML = `${jsVar} = new ${jsClass}();`;
              h.appendChild(declaration);
            };
            h.appendChild(scriptTag);
            
            break;
        }
      }
    }
  }

  /**
   * Render partial QWC
   * @param {HTMLTemplateElement} temp
   */
  _renderWebComponents(temp) {
    this._renderLinks(temp);
  }

  /**
   * Render href links (Auto router)
   */
  _renderLinks(temp) {
    const links = temp.content.querySelectorAll('a[href]');
    const expts = ['#', 'javascript:', 'http:', 'mailto:', 'tel:'];
    for (const link of links) {
      let str = link.getAttribute('href');
      let isExcept = false;
      for (const ex of expts) {
        if (str.indexOf(ex) > -1) {
          isExcept = true;
          break;
        }
      }

      if (!isExcept)
        link.setAttribute('href', '#!' + str);
    }
  }
}
