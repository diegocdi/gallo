customElements.define('x-form', class extends HTMLElement {
    constructor() {
        super();
        this.form = null;
        this.http = new Http();
    }

    get action() {
        return this.form.action;
    }

    set action(url) {
        this.form.action = url;
    }

    get controls() {
        return this.querySelectorAll('[property]');
    }

    _getProp(ctrl) {
        return ctrl.getAttribute('property');
    }

    _setValid(ctrl, bool) {
        const node = ctrl.closest('fieldset') || this.parentNode || document.createElement('div');        
        return bool ? node.removeAttribute('invalid') :  node.setAttribute('invalid', '');
    }

    connectedCallback() {
        if (!this.querySelector('form')) {
            this.form = document.createElement('form');
            this.form.setAttribute('style', 'margin:0px;padding:0px;background:transparent;');
            this.form.setAttribute('autocomplete', 'off');
            this.form.id = this.id;
            this.id = "_" + this.id;
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            const arr = this.children;
            this.appendChild(this.form);
            for( const el of arr)
                this.form.appendChild(el);
        }
    }

    validate() {
        const ctrls = this.controls;
        const arrMsgs = new Array();
        for (const ctrl of ctrls) {
            if (ctrl.validate) {
                const msgs = ctrl.validate();
                for (const msg of msgs) {
                    arrMsgs.push(msg);
                }
            }
        }

        return arrMsgs;
    }

    getData(boolValidate) {
        if (boolValidate) {
            const valMsgs = this.validate();
            if (valMsgs.length > 0)
                return valMsgs;
        }

        let obj = new Object();
        const ctrls = this.controls;
        for (const ctrl of ctrls) {
            try {
                const prop = this._getProp(ctrl);
                obj[prop] = ctrl.valuex() || ctrl.value;
            } catch (e) {
                console.error(ctrl.tagName + '=' + ctrl.id + ' (' + e.message + ')');
            }
        }

        return obj;
    }


    async post(data) {
        data = data || this.getData(true);
        return await this.http.post(this.action, data, true);
    }

    async delete(data) {
        let id = 0;
        if (typeof data === 'number') {
            return await this.http.delete(`${this.action}/${data}`, null, true);
        } else {
            data = data || this.getData(true);
            return await this.http.delete(this.action, data, true);
        }
    }
    
    setData(data) {
        const ctrls = this.controls;
        for (const ctrl of ctrls) {
            const prop = this._getProp(ctrl);
            ctrl.valuex = data[prop];
        }
    }
});