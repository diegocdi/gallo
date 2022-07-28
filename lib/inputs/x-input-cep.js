var XInputCep = {
  render : (ipt) => {
    ipt.setAttribute('type','tel');
    ipt.setAttribute('maxlength', 9);    
    ipt.addEventListener('paste', XInputCep.format);
    ipt.addEventListener('blur', XInputCep.format);
    ipt.addEventListener('input', XInputCep.format);
  },
  format : (evt) => {
    let val = evt.target.value;
    val = val.replace(/\D/g, '');
    val = val .replace(/(\d{5})(\d)/, '$1-$2');
    evt.target.value = val;
  }
};