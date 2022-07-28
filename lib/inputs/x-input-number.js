var XInputNumber = {
  _decimalSeparator: ',',
  _decimalLength: '0',
  _thousandSeparator: '.',
  _navigatorLanguage: 'pt-br',

  render: (ipt) => {
    XInputNumber._decimalSeparator = ipt.getAttribute('decimal-separator') || ',';
    XInputNumber._decimalLength = ipt.getAttribute('decimal-length') || '0';
    XInputNumber._thousandSeparator = XInputNumber._decimalSeparator === ',' ? '.' : ',';
    XInputNumber._navigatorLanguage = ipt.getAttribute('locale') || navigator.language;
    ipt.setAttribute('maxlength', ipt.getAttribute('maxlength') || '15');
    ipt.setAttribute('type', 'tel');
    
    ipt.onblur = XInputNumber._formatNumber;
    
    ipt.onpaste = (evt) => {
      setTimeout(() => {
        XInputNumber._formatNumber(evt);
      }, 100);
    };
    
    ipt.onfocus = () => {
      ipt.value = ipt.value.replaceAll(XInputNumber._thousandSeparator, '');
    };

    ipt.oninput = () => {
      if (XInputNumber._decimalLength === '0') {
        ipt.value = ipt.value.replace(/[^0-9]+/g, '');  // numbers only
      } else if (XInputNumber._decimalSeparator === '.') {
        ipt.value = ipt.value
          .replace(/[^\d.]/g, '')             // numbers and decimals only
          .replace(/(^[\d]{9})[\d]/g, '$1')   // not more than 9 digits at the beginning
          // eslint-disable-next-line no-useless-escape
          .replace(/(\.,*)\,/g, '$1')         // decimal can't exist more than once
          // eslint-disable-next-line no-useless-escape
          .replace(/(\.[\d]{4}),/g, '$1');    // not more than 4 digits after decimal
      } else {               
        ipt.value = ipt.value
          .replace(/[^\d,]/g, '')             // numbers and decimals only
          .replace(/(^[\d]{9})[\d]/g, '$1')   // not more than 9 digits at the beginning          
          // eslint-disable-next-line no-useless-escape
          .replace(/(\,.*)\,/g, '$1')         // decimal can't exist more than once
          // eslint-disable-next-line no-useless-escape
          .replace(/(\,[\d]{4})./g, '$1');    // not more than 4 digits after decimal
      }
    };    
  },

  _formatNumber: (evt) => {            
    let val = evt.target.value;
    val = val.replaceAll(XInputNumber._thousandSeparator,  '');
    val = val.indexOf(',') === -1 ? val : val.replaceAll(',', '.');
    let num = parseFloat(val);
    // @ts-ignore
    val = isNaN(num) ? '' : num.toLocaleString(this.local, { minimumFractionDigits: XInputNumber._decimalLength });

    evt.target.value = val;
  }
};
