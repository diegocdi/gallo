class XButton extends HTMLButtonElement {
    constructor() {
        super();
        this._visible = true;
        this._isLoading = false;
        this.iconClass = this.getAttribute('icon-class');
        this.label = this.getAttribute('label');
        this.cursor = 'cursor:pointer';
    }

    static get observedAttributes() {
        return ['loading'];
    }
   
    get loading() {
        return this._isLoading;
    }

    set loading(val) {
        this._isLoading = val;
        const ico = this.querySelector('i');
        if (ico && val)
            ico.setAttribute('class', 'fas fa-spinner fa-spin');
        else
            ico.setAttribute('class', this.iconClass);
    }

    get visible() {
        return this._visible;
    }

    set visible(bool) {
        this._visible = bool;
        const disp = bool ? 'inline-block' : 'none';
        this.style.display = disp;
    }

    connectedCallback() {
        if (this.children.length === 0) {
            this._render();
        }
    }

    attributeChangedCallback(name, oldval, newval) {
        this.loading = (newval !== null);
    }

    _render() {
        const lbl = document.createElement('span');
        lbl.innerHTML = this.label;
        const ico = document.createElement('i');
        ico.setAttribute('class', this.iconClass);
        
        this.appendChild(ico);
        this.appendChild(lbl);
    }

    _setLoading() {
        const ico = this.querySelector('i');
        const css = this._isLoading ? 'fas fa-spinner fa-spin' : this.iconClass;
        ico.setAttribute('class', css);
    }
}

customElements.define('x-button', XButton, { extends: "button" });