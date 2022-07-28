class XInputAutocomplete_ extends XInput {   
    constructor() {
        super();
        this.setAttribute('button-id', `button_${this.id}`);
        this.setAttribute('button-icon', 'fas fa-chevron-down');        
        super.render();

        this.http = new Http();
        this._data = new Array();
        this._selected = new Object();
        this._timer = undefined;
        
        this._value = '';
        this._focused = 0;        
        this._template = '';
        this._url = '';        
    }

    get valuex() {
        return this._value;
    }

    set valuex(val) {
        this._value = val;
    }

    get templateID() {
        return this.getAttribute('template-id') || '';
    }

    get notFoundLabel() {
        return this.getAttribute('not-found-label') || 'Nenhum registro encontrado';    
    }

    get newLabel() {
        return this.getAttribute('add-new-label');
    }

    get newUrl() {
        return this.getAttribute('add-new-url');
    }

    connectedCallback() {
        if (!this.getAttribute('upgraded')) {
            this.setAttribute('upgraded','upgraded');
            this.render();
        }
    }

    render() {
        // Ajusta template e URL de requisição
        const temp = document.getElementById(this.templateID);
        const objURL = temp.content.querySelector('url');
        if (!objURL)
            console.error('<url></url> not found in template');
        else {
            this._url = objURL.textContent;
            temp.content.removeChild(objURL);
            this._template = temp.innerHTML;
        }
        
        // Ajusta botão do dropdow
        this.onfocus = (e) => {
            document.getElementById(this.getAttribute('button-id')).onclick = (e) => {
                const ul = document.querySelector('.x-input-autocomplete-list')
                if (ul)
                    this._clear(true);
                else
                    this._loadData(true);
            };
        };

        // Blur
        this.onblur = (e) => {
            clearInterval(this._timer);
            this._clear(false);
        }

        // Keydow
        this.onkeydown = (e) => {
            this._renderList(e);
        };
    }

    _renderList(e) {
        const key = e.keyCode;
        switch (key) {

            //Page Down
            case 34:
                this._setFocused(5);
                break;

            //Arrow Down
            case 40:
                this._setFocused(1);
                break;

            //Page Up
            case 33:
                this._setFocused(-5);
                break;

            //Arrow up
            case 38:
                this._setFocused(-1);
                break;

            //Enter
            case 13:
                this._selectItem();
                e.preventDefault();
                break;

            //Esc
            case 27:
                this._clear(true);
                break;

            //Other keys
            default:
                if (this._timer)
                    clearInterval(this._timer);

                this._timer = setInterval(() => {
                        clearInterval(this._timer);
                        this._loadData();
                }, 500);            

                break;
        }
    }

    async _loadData(all) {
        this._setLoading(true);
        
        const url = eval('`' + this._url + '`');        
        const pnode = this.closest('fieldset') || this.parentNode;
        const frag = document.createDocumentFragment();
        const list = await this.http.get(url);

        this._setLoading(false);
        
        let ul = document.querySelector('.x-input-autocomplete-list')
        if (ul) ul.parentNode.removeChild(ul);
        if (!list) return;

        ul = document.createElement('ul');
        ul.setAttribute('class', 'x-input-autocomplete-list');
        ul.setAttribute('style', 'width:' + pnode.offsetWidth + 'px');
        if (list.length === 0) {
            this._setNotFound(ul);
            return;
        }

        this._focused = 0;        
        this._data = list;
        let i = 0;
        for (const model of list) {
            const li = document.createElement('li');
            const temp = eval('`' + this._template + '`');
            li.innerHTML = temp;
            li._idx = i++;
            li.onmouseenter = (e) => {
                this._setFocused(li._idx, true);
            }

            li.onclick = (e) => {
                this._focused = li._idx;
                this._selectItem();
            };

            frag.appendChild(li);
        }
        
        ul.appendChild(frag);
        ul.firstChild.setAttribute('active', '');        
        pnode.appendChild(ul);
        pnode.setAttribute('style', 'overflow:visible');
        this._setFocused(0);
    }

    _setFocused(idx, ismouse) {
        if (!ismouse)
            this._focused += idx;
        else
            this._focused = idx;

        if (this._focused >= this._data.length) this._focused = this._data.length - 1;
        if (this._focused < 0) this._focused = 0;

        const ul = document.querySelector('.x-input-autocomplete-list');
        for (let i = 0; i < ul.children.length; i++)
            ul.children[i].removeAttribute('active');
        ul.children[this._focused].setAttribute('active', '');

        if (!ismouse) {
            let intScroll = 0;
            if (this._focused > 3)
                intScroll = this._focused - 3;

            ul.scrollTo(0, (intScroll * ul.children[this._focused].offsetHeight) + 5); //+5 � por causa do padding do UL
        }
    }

    _selectItem() {
        const obj = this._data[this._focused];
        this._clear(false);
        this._value = obj[this.getAttribute('model-value')];
        this.value = obj[this.getAttribute('model-text')];        
    }
   
    _clear(all) {
        if (all) {
            this._value = '';
            this.value = '';
            this._focused = 0;
        }
        const ul = document.querySelector('.x-input-autocomplete-list');
        if (ul) ul.parentNode.removeChild(ul);
    }

    _setNotFound(ul) {
        const pnode = this.closest('fieldset') || this.parentNode;
        const li = document.createElement('li');
        
        if (this.newLabel) {
            li.setAttribute('add-new', '');
            li.innerHTML = '<i class="fas fa-plus-circle"></i> ' + this.newLabel
            li.onclick = (e) => {
                this._addNew(this.value, newUrl);
            }
        } else {
            li.setAttribute('not-found', '');
            li.innerHTML = '<i class="far fa-frown-open"></i> ' + this.notFoundLabel
        }

        ul.appendChild(li);
        pnode.appendChild(ul);
    }

    async _addNew(val, url) {
        const http = new Controller();
        const resp = await http.get(url);
    }

    _setLoading(active) {
        this._loading = active;
        const btn = document.getElementById(this.getAttribute('button-id'));        
        if (active) 
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        else
            btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

customElements.define('x-input-autocomplete', XInputAutocomplete, { extends: "input" });