class _XInputCep extends XInput {
    constructor() {
        super();
        this.setAttribute('button-id', `button_${this.id}`);
        this.setAttribute('button-icon', 'fas fa-search');
        this.setAttribute('maxlength', '9');
        this.setAttribute('type', 'search');
        super.render();

        this._loading = false;
    }

    get valuex() {
        return this.value.trim().unformat();
    }

    set valuex(val) {
        this.value = val.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
    }

    get buttonID() {
        return this.getAttribute('button-id');
    }

    get validationMessage() {
        return this.getAttribute('validation-message') || 'Cep inválido';
    }

    connectedCallback() {
        if (!this.getAttribute('upgraded')) {
            this.setAttribute('upgraded','upgraded');
            this.render();
        }
    }
    
    render() {            
        this.oninput = (e) => {
            this.value = this.value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
            if (this.value.length === 9)
                this.onsearch();
        };

        this.onsearch = (e) => {            
            const url = $THIRD_API.ViaCep.url.replaceAll('[VALUE]', this.value.unformat());            
            this.searchZipCode(url);            
        };

        const btn = document.getElementById(this.buttonID);
        btn.onclick = this.onsearch;
    }

    async searchZipCode(url) {
        try {   
            this._setLoading(true);                     
            const resp = await fetch(url);
            const json = await resp.json();
            if (json.errors) {
                console.error(json.errors);
                this._setLoading(false);
                this._returnResult({erro: true});                
            }                
            else {
                this._setLoading(false);
                this._returnResult(json);                
            }
        } catch (ex) {
            this._setLoading(false);
            this._returnResult({erro: true});
            console.error(ex);
        }        
    }

    _returnResult(resp) {
        const e = { detail: new Object() };
        if (resp.erro) {
            e.detail.error = true;
        } else {            
            const mp = $THIRD_API.ViaCep.mapping            
            if (mp) {
                Object.keys(mp).forEach(function(key) {
                    e.detail[mp[key]] = resp[key];
                });      
            } else {
                e.detail = resp;
            }                    
        }
        this.dispatchEvent(new CustomEvent("result", e));
    }

    _setLoading(active) {
        this._loading = active;
        const btn = document.getElementById(this.getAttribute('button-id'));        
        if (active) 
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        else
            btn.innerHTML = '<i class="fas fa-search"></i>';
    }
}

customElements.define('x-input-cep', XInputCep, { extends: "input" });