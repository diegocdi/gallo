/* eslint-disable no-undef */
class XInput extends HTMLInputElement {
  constructor() {
    super();
    this._value = '';
    this._type = '';
    this._loading = false;
    this.inputButton = document.createElement('button');    
  }

  get loading() {
    return this._loading;
  }

  set loading(val) {
    this._loading = val;
    if (val) {
      if (!this.getAttribute('button-icon-cache'))
        this.setAttribute('button-icon-cache', this.getAttribute('button-icon'));
      this.inputButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    } else {
      this.inputButton.innerHTML = `<i class="${this.getAttribute('button-icon-cache')}"></i>`;
    }
  }

  get valuex() {
    return this.getValueOfType();
  }

  set valuex(val){
    this.setValueOfType();
  }

  /**
   * https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements#usando_os_callbacks_do_ciclo_de_vida
   */
  static get observedAttributes() {
    return [
      'type'      
    ];
  }

  /**
   * https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements#usando_os_callbacks_do_ciclo_de_vida
   * @param {string} attrName 
   * @param {string} oldVal 
   * @param {string} newVal 
   */
  attributeChangedCallback(attrName, oldVal, newVal) {
    oldVal = null;
    newVal = null;
    switch (attrName) {
      case 'type':
        break;      
    }
  }

  /**
   * https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements#usando_os_callbacks_do_ciclo_de_vida
   */
  connectedCallback() {
    if (!this.getAttribute('upgraded')) {
      this.setAttribute('upgraded', 'true');
      this._type = this.getAttribute('type');
      this.render();
    }
  } 

  /**
   * Render webcomponent
   */
  render() {
    const ctner = document.createElement('div');    
    const field = document.createElement('div');
    const label = document.createElement('label');
    const button = document.createElement('button');
    const errLabel = document.createElement('label');
      
    field.className = 'x-input__input-field';
    label.className = 'x-input__input-label';
    label.innerHTML = this.getAttribute('label') || this.getAttribute('placeholder') || '';
    button.className = 'x-input__input-button';
    errLabel.className = 'x-input__input-error-label';

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

    this.renderType();
  }

  /**
   * Render webcomponent by type
   */
  renderType() {
    switch (this._type) {
      case 'cnpj':
        XInputCnpj.render(this);
        break;
      case 'cep':
        XInputCep.render(this);
        break;
      case 'autocomplete':
        XInputAutocomplete.render(this);
        break;
      case 'number':
        XInputNumber.render(this);
        break;
      default:
        break;
    }
  }

  /**
   * Returns value of type
   * @returns {any}
   */
  getValueOfType() {    
    switch (this._type) {
      case 'date':        
        break;
    
      default:
        this.value;
        break;
    }
  }

  /**
   * Set value of type
   * @param {any} val 
   */
  setValueOfType(val) {
    switch (this._type) {
      case 'date':        
        break;
    
      default:
        this._value = val;
        this.value = val;
        break;
    }
  }

  validate() {
    return null;
  }
}

customElements.define('x-input', XInput, { extends: 'input' });
