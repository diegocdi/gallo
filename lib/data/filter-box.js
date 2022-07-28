class FilterBox extends HTMLDivElement {   
    constructor() {
        super();
        this._propName = this.getAttribute('property');
        this.ibutton = document.createElement('i');
        this.ibutton.setAttribute('class', 'far fa-list-alt search-filter-button');
    }

    connectedCallback() {
        if (this.children.length === 0)
            this._render();
    }

    _render() {        
        const div = document.createElement('div');
        div.setAttribute('class', 'search-bar');

        const span = document.createElement('span');
        span.setAttribute('class', 'search-box');                

        const ico = document.createElement('i');
        ico.setAttribute('class', 'fas fa-search search-ico');

        const input = document.createElement('input');
        input.setAttribute('type', 'search');
        input.setAttribute('placeholder', this.getAttribute('placeholder'));

        div.appendChild(span);
        div.appendChild(this.ibutton);

        span.appendChild(input);
        span.appendChild(ico);

        input.addEventListener('search', (event) => {
            this.dispatchEventCustom(event.target.value);
        });
        ico.onclick = () => {
            this.dispatchEventCustom(input.value);
        };

        this.appendChild(div);
    }

    dispatchEventCustom(stringValue) {
        this.activateFilter();
        let obj = new Object();
        obj.detail = new Object();
        obj.detail[this._propName] = stringValue;
        this.dispatchEvent(new CustomEvent("search", obj));
    }

    activateFilter() {
        this.ibutton.setAttribute('active-filter', '');
        this.ibutton.setAttribute('class', 'fas fa-list-alt search-filter-button');
        this.setAttribute('filter-value', this._getFilterValues());
    }

    deactivateFilter() {
        this.ibutton.removeAttribute('active-filter');
        this.ibutton.setAttribute('class', 'far fa-list-alt search-filter-button');
        this.setAttribute('filter-value', '');
    }    

    _getFilterValues() {
        return this._propName + '=' + input.value;

        
        // return Object.keys(filterObject).map(function (k) {
        //     return encodeURIComponent(k) + "=" + encodeURIComponent(filterObject[k]);
        // }).join('&');
    }
}

customElements.define('filter-box', FilterBox, { extends: "div" });