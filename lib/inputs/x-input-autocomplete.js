var XInputAutocomplete = {
  render : (ipt) => {
    // Adjust html elements    
    // @ts-ignore
    const optionsCtner = document.createFromHTML('<span class="x-input__options-selected"></span>');
    // @ts-ignore
    const ul = document.createFromHTML('<ul class="x-input__autocomplete-list" visible="false"></ul>');    
    // @ts-ignore
    ipt.inputButton = document.createFromHTML('<button type="button"><i class="fas fa-chevron-down></i></button>');
    ipt.setAttribute('button-icon','fas fa-chevron-down');
    ipt.setAttribute('button-icon-cache','fas fa-chevron-down');
    ipt.parentNode.insertBefore(optionsCtner, ipt);
    ipt.parentNode.appendChild(ul);

    XInputAutocomplete._setEvents(ipt);
  },

  _setEvents : (ipt) => {
    // @ts-ignore
    ipt.inputButton.onclick = () => {
      if (ipt.getAttribute('opened')) {
        XInputAutocomplete._closeList(ipt);
      } else {
        XInputAutocomplete._openList(ipt);
      }
    };

    // @ts-ignore
    ipt.onfocus = () => {
      XInputAutocomplete._openList(ipt);
    };

    // @ts-ignore
    ipt.onblur = () => {
      XInputAutocomplete._closeList(ipt);
    };

    ipt.onkeydown = (evt) => {
      const key = evt.keyCode;
      switch (key) {
        //Page Down
        case 34:
          XInputAutocomplete._setFocused(ipt, 5);
          break;
        //Arrow Down
        case 40:
          XInputAutocomplete._setFocused(ipt, 1);
          break;
        //Page Up
        case 33:
          XInputAutocomplete._setFocused(ipt, -5);
          break;
        //Arrow up
        case 38:
          XInputAutocomplete._setFocused(ipt, -1);
          break;
        //Enter
        case 13:
          XInputAutocomplete._selectItem(ipt);
          evt.preventDefault();
          break;
        //Esc
        case 27:
          XInputAutocomplete._clear(true);
          break;
        //Other keys
        default:
          XInputAutocomplete._openList(ipt);
          break;
      }
    };
  },

  _openList : (ipt) => {
    // Clear list
    ipt._focused = 0;
    const ctner = ipt.parentNode.parentNode;
    const ul = ctner.querySelector('ul');
    while (ul.children.length > 0) {
      ul.removeChild(ul.children[0]);
    }

    // Obtain data
    let data = [];
    if (ipt.getAttribute('url')) {
      data = XInputAutocomplete._loadData(ipt.getAttribute('url'));
    } else {
      try {
        data = JSON.parse(ipt.getAttribute('data'));
      } catch(e) {
        try {
          data = ipt.getAttribute('data').split(',');
        } catch(ee) {
          console.error('Invalid attribute data="" or url=""');
        }        
      }
    }

    // Bind data to list
    for (let i = 0; i < data.length; i++) {
      let li = document.createElement('li');        
      const tempHtml = XInputAutocomplete._getTemplate(ipt.getAttribute('template-id'));        
      if (tempHtml) {
        li.innerHTML = eval('`' + tempHtml + '`');
        li.setAttribute('model-value',data[i][ipt.getAttribute('model-value')]);
        li.setAttribute('model-text', data[i][ipt.getAttribute('model-text')]);
      } else {
        li.innerHTML = data[i];
        li.setAttribute('model-value',data[i]);
        li.setAttribute('model-text', data[i]);
      }

      // Attach onclick event
      // @ts-ignore
      li._idx = i;
      li.onclick = () => {
        // @ts-ignore
        ipt._focused = li._idx;
        XInputAutocomplete._selectItem(ipt, li);
      };

      ul.appendChild(li);      
    }

    ul.setAttribute('style', 'width:' + (ipt.parentNode.offsetWidth) + 'px');
    ul.removeAttribute('visible');
  },

  _closeList : (ipt) => {    
    const ctner = ipt.parentNode.parentNode;
    const ul = ctner.querySelector('ul');    
    setTimeout(()=>{ipt._focused = -1;ul.setAttribute('visible', false);}, 100);
  },

  // Get template for rendering (optional)
  _getTemplate : (tempID) => {
    if (tempID) {
      const tempHtml = document.getElementById(tempID);      
      if (tempHtml) {
        return tempHtml.innerHTML;
      } else {
        console.error(`template id="${tempID}" not found.`);
      }
    }
    return undefined;
  },

  _selectItem : (ipt, li) => {
    if (!li) {
      const ctner = ipt.parentNode.parentNode;
      const ul = ctner.querySelector('ul');
      li = ul.children[ipt._focused];
    }
    
    ipt.value = li.getAttribute('model-text');
    ipt.valuex = li.getAttribute('model-value');
  },

  _setFocused(ipt, idx, ismouse) {
    const ctner = ipt.parentNode.parentNode;
    const ul = ctner.querySelector('ul');
    if (!ismouse)
      ipt._focused += idx;
    else
      ipt._focused = idx;

    if (ipt._focused >= ul.children.length) ipt._focused = ul.children.length - 1;
    if (ipt._focused < 0) ipt._focused = 0;

    for (let i = 0; i < ul.children.length; i++)
      ul.children[i].removeAttribute('active');
    ul.children[ipt._focused].setAttribute('active', '');

    if (!ismouse) {
      let intScroll = 0;
      if (ipt._focused > 3)
        intScroll = ipt._focused - 3;

      ul.scrollTo(0, (intScroll * ul.children[ipt._focused].offsetHeight) + 5); //+5 � por causa do padding do UL
    }
  }
};