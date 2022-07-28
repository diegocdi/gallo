var XInputCnpj = {
  render : (ipt) => {
    ipt.setAttribute('type','text');
    ipt.setAttribute('maxlength', 18);    
    ipt.addEventListener('paste', XInputCnpj.format);
    ipt.addEventListener('blur', XInputCnpj.format);
    ipt.addEventListener('input', XInputCnpj.format);
  },
  format : (evt) => {
    let val = evt.target.value;
    val = val.replace(/\D/g, '');
    val = val.replace(/^(\d{2})(\d)/, '$1.$2');
    val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    val = val.replace(/\.(\d{3})(\d)/, '.$1/$2');
    val = val.replace(/(\d{4})(\d)/, '$1-$2');
    evt.target.value = val;
  }
};