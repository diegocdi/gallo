class XForm extends HTMLFormElement {
  /**
   * constructor
   */
  constructor() {
    super();
    this._http = new Http();
    this._toast = new Toast();
    this.setAttribute('autocomplete', 'off');
    this.onsubmit = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
    };
  }

  /**
   * connectedCallback
   */
  connectedCallback() {
    if (!this.getAttribute('upgraded')) {
      this.setAttribute('upgraded', 'true');
    }
  }

  /**
   * Returns all inputs with property atribute
   * @returns {Array<XInput>}
   */
  _getControls() {
    return Array.from(this.querySelectorAll('[property]'));
  }

  /**
   * Get form data
   * @param {boolean} isValidate 
   * @returns {any}
   */
  getData(isValidate) {
    if (isValidate) {
      const valErrors = this.validate();
      if (valErrors) return valErrors;
    }

    let obj = {};
    const ctrls = this._getControls();
    for (const ctrl of ctrls) {
      let prop = ctrl.getAttribute('property');
      if (prop.indexOf('.') === -1) {
        obj[prop] = ctrl.valuex;
      } else {
        const props = prop.split('.');
        XUtils.setNestedObject(obj, props, ctrl.value);
      }
    }

    return obj;
  }

  /**
   * Set form data
   * @param {any} data 
   */
  setData(data) {
    const ctrls = this._getControls();
    for (const ctrl of ctrls) {
      let prop = ctrl.getAttribute('property');
      if (prop.indexOf('.') === -1) {
        ctrl.value = data[prop] || '';
      } else {
        const props = prop.split('.');
        ctrl.value = XUtils.getNestedObject(data, props);
      }
    }
  }

  /**
   * Form validate
   * @returns {any}
   */
  validate() {
    const arrErrors = [];
    const ctrls = this._getControls();
    for (const ctrl of ctrls) {
      const err = ctrl.validate();
      if (err) {
        arrErrors.push(err);
      }
    }

    return arrErrors.length === 0
      ? undefined
      : { errors: arrErrors };
  }
}

customElements.define('x-form', XForm, { extends: 'form' });
