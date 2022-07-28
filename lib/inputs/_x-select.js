customElements.define('x-select', class extends HTMLSelectElement {
  /**
   * Construtor
   */
  constructor() {
    super();
    this.inputButton = document.createElement('button');
    this._loadingIcon = 'fas fa-spinner fa-spin';    
    this._buttonIcon = 'fas fa-chevron-down';
    this._type = this.getAttribute('type');
    this._url = this.getAttribute('url');
    this._loading = false;
    this._value = '';
    this._data = [];    
  }

  /**
   * https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements#usando_os_callbacks_do_ciclo_de_vida
   */
  static get observedAttributes() {
    return [
      'url'
    ];
  }

  /**
   * https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements#usando_os_callbacks_do_ciclo_de_vida
   * @param {string} attrName 
   * @param {string} oldVal 
   * @param {string} newVal 
   */
  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'url':
        //this.setType(newVal);
        break;      
    }
  }

  /**
   * https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements#usando_os_callbacks_do_ciclo_de_vida
   */
  connectedCallback() {            
    this.render();
  } 

  get loading() {
    return this.loading;
  }

  set loading(val) {
    this._loading = val;
    const ico = val ? '<i class="fas fa-spinner fa-spin"></i>' : '<i class="fas fa-chevron-down"></i>';
    this.inputButton.innerHTML = ico;
  }

  get valuex() {
    return this.valueOfType(this.type);
  }

  set valuex(val){
    this.setValueOfType(this.type, val);
  }

  render() {
    if (!this.getAttribute('upgraded')) {
      this.setAttribute('upgraded', true);
      switch (this._type) {
        case 'multi':
          XSelectMulti.render(this);
          break;
        case 'autocomplete':
          XSelectAutoComplete.render(this);
          break;
        default:
          XSelectSimple.render(this);
          break;
      }
    }
  }
      
      
      
      

      ctner.appendChild(label);
      ctner.appendChild(field);
      ctner.appendChild(errLabel);

      this.parentNode.insertBefore(ctner, this);
      field.appendChild(this);

      const btnIcon = this.getAttribute('button-icon');    
      if (btnIcon) {
        this.inputButton.innerHTML = `<i class="${btnIcon}"></i>`;
        this.inputButton.setAttribute('type','button');
        this.inputButton.setAttribute('tabindex','-1');
        this.inputButton.setAttribute('onclick', this.getAttribute('button-click'));
        this.setAttribute('button-icon-cache', btnIcon);
        field.appendChild(this.inputButton);
      }
      this.renderType(this.getAttribute('type'));
    }
  }

  valueOfType(typ) {
    switch (typ) {
      case 'date':        
        break;
    
      default:
        this.value;
        break;
    }
  }

  setValueOfType(typ, val) {
    switch (typ) {
      case 'date':        
        break;
    
      default:
        this._value = val;
        this.value = val;
        break;
    }
  }

  renderType(typ) {
    switch (typ) {
      case 'cnpj':
        XInputCnpj.render(this);
        break;
      case 'cep':
        XInputCep.render(this);
        break;
        
        break;
    
      default:
        break;
    }
  }
}, 
{ extends: 'input' });


class XSelect extends HTMLSelectElement {
    constructor() {
        super();
        this.http = new Http();
    }    

    get label() {
        return this.getAttribute('label');
    }

    set label(text) {                
        const parent = this.parentNode;        
        const obj = parent.tagName.toLowerCase() === 'fieldset' 
            ? (parent.querySelector('legend') || document.createElement('legend'))
            : (parent.querySelector('label') || document.createElement('label'));
        obj.textContent = text;
        parent.insertBefore(obj, this);
    }

    get url() {
        return this.getAttribute('url');
    }

    set url(value) {
        if (value)
            this._loadRemote(value);
    }

    static get observedAttributes() {
        return ['label','url'];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        switch(attr) {
            case "label":
                this.label = newValue;
                break;
            case "url":
                this.url = newValue;
                break;
        }
    }

    connectedCallback() {
        if (!this.getAttribute('upgraded')) {
            this.setAttribute('upgraded','upgraded');
            this.render();
        }
    }

    render() {
        this.parentNode.className += ' _select';
        this.label = this.getAttribute('label');
        this.url = this.getAttribute('url');
        this.closest('div').style.maxHeight = '51px';        
    }

    async _loadRemote(remoteURL) {
        const values  = await this.http.get(remoteURL);
        while (this.options.length > 0)
            this.options.remove(0);

        const emptyText = this.getAttribute('empty-text');
        const emptyValue = this.getAttribute('empty-value');
        const modelValue = this.getAttribute('model-value');
        const modelText = this.getAttribute('model-text');
        this.options.add(new Option(emptyText, emptyValue));
        for(const item of values) {
            const opt = new Option(item[modelText], item[modelValue]);
            this.options.add(opt);
        }
    }
}

customElements.define('x-select', XSelect, { extends: "select" });