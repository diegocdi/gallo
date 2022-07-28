customElements.define('x-checkbox', class XCheckbox extends HTMLInputElement {
    constructor() {
        super();        
        this.type = 'checkbox';
        this.checkedIcon = this.getAttribute('checked-icon') || 'fas fa-check-square';
        this.unCheckedIcon = this.getAttribute('unchecked-icon') || 'far fa-square';
        this.label = this.getAttribute('label') || '';
    }

    get valuex() {
        return this.checked;
    }

    set valuex(val) {
      this.checked = val;
    }

    connectedCallback() {
      const id = this.getAttribute('id');
      if (!id) {
        console.error('Checkbox must have an ID');
      }

      if (!document.getElementById('label-' + id)) {
        this.render(id);
      }
    }
    
    render(id) {        
      const lbl = document.createElement('label');
      const span = document.createElement('span');
      const i = document.createElement('i');

      lbl.setAttribute('id', 'label-' + id);
      lbl.setAttribute('for', id);
      lbl.setAttribute('style','cursor:pointer');

      span.setAttribute('style', 'position:relative;top:-3px;vertical-align:middle;');
      span.innerHTML = this.label;

      i.setAttribute('class', this.checked ? this.checkedIcon : this.unCheckedIcon);

      lbl.appendChild(i);
      lbl.appendChild(span);
      lbl.addEventListener('click', (e) => {
        setTimeout(() => {
          i.setAttribute('class', this.checked ? this.checkedIcon : this.unCheckedIcon);
        }, 100);
      });

      // Adds the label element after input element for css + porpouses
      const nextElem = this.nextSibling;
      if (this.nextSibling) {
        this.parentNode.insertBefore(lbl, nextElem);
      } else {
        this.parentNode.appendChild(lbl);
      }
    }
}, 
{ extends: "input" });