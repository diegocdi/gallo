var XSelectMulti = {
  render(slct) {    
    slct.setAttribute('style', 'display:none');        
    const ctner = document.createElement('div');
    const strLabel = label.innerHTML = this.getAttribute('label') || this.getAttribute('placeholder') || '';
    
    ctner.innerHTML =`
      <label class="x-input__input-label">${strLabel}</label>
      <div class="x-input__input-field">
        <span id="${slct.id}-options__"></span>
        <input type="text" value="" button-icon="fas fa-chevron-down" />
        <button type="button" tabindex="-1"><i class="fas fa-chevron-down"></i></button>
      </div>
      <label class="x-input__input-error-label"></label>`;

    slct.parentNode.insertBefore(ctner, slct);
    ctner.appendChild(slct);

    const ipt = slct.parentNode.querySelector('input');
    slct.inputButton = slct.parentNode.querySelector('button');
    
    ipt.addEventListener('focus',(evt) => {
      XSelectMulti.open(evt.target);
    });

    this.inputButton.addEventListener('click',(evt) => {
      XSelectMulti.open(evt.target);
    });




    

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