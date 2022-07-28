class XInputCpfCnpj extends XInput {
    constructor() {
        super();
        this.setAttribute('button-id', `button_${this.id}`);
        this.setAttribute('button-icon', 'fas fa-search');
        this.setAttribute('maxlength', '18');
        this.setAttribute('type', 'search');
        super.render();

        this._loading = false;
    }

    get isCnpj() {
        return this.value.trim().unformat().length === 14;
    }

    get isCpf() {
        return this.value.trim().unformat().length <= 11;
    }

    get valuex() {
        return this.value.trim().unformat();
    }

    set valuex(val) {
        this.value = val;
        this._formatCpfCnpj();
    }

    get validationMessage() {
        return this.getAttribute('validation-message');
    }

    connectedCallback() {
        if (!this.getAttribute('upgraded')) {
            this.setAttribute('upgraded','upgraded');
            this.render();
        }
    }

    render() {
        this.onpaste = this._formatCpfCnpj;
        this.onblur = () => { this._formatCpfCnpj(true); };
        this.oninput = this._formatCpfCnpj;
        this.onsearch = (e) => {
            this.parentNode.removeAttribute('invalid');
            if (this.isCnpj && this._validateCnpj()) {
                const url = $THIRD_API.Cnpj.url.replaceAll('[VALUE]', this.valuex);
                this._searchCNPJ(url);
            } else if (this.isCpf && this._validateCpf()) {
                this._findCpf(this.valuex);
            } else {
                new Toast().error(this.validationMessage);
                this.parentNode.setAttribute('invalid','');
                this.focus();
            }
        }
        const btn = document.getElementById(this.buttonID);
        btn.onclick = this.onsearch;
    }

    validate() {
        let isvalid = (this.isCnpj) ? this._validateCnpj() : this._validateCpf();
        if (!isvalid) return this.validationMessage;
        return undefined;
    }

    _formatCpfCnpj(isBlur) {
        let val = this.valuex;
        if (val.length <= 11) {//---- CPF
            val = val.replace(/\D/g, "");
            val = val.replace(/(\d{3})(\d)/, "$1.$2");
            val = val.replace(/(\d{3})(\d)/, "$1.$2");
            val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else {//------------------- CNPJ
            val = val.replace(/\D/g, "");
            val = val.replace(/^(\d{2})(\d)/, "$1.$2");
            val = val.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            val = val.replace(/\.(\d{3})(\d)/, ".$1/$2");
            val = val.replace(/(\d{4})(\d)/, "$1-$2");
        }
        this.value = val;

        if (isBlur !== true && this.value.length === 18)
            this.onsearch();
    }

    async _searchCNPJ(url) {
        if (this._loading) return;

        try { 
            this._setLoading(true);                    
            const header = {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": $THIRD_API.Cnpj["x-rapidapi-host"],
                    "x-rapidapi-key": $THIRD_API.Cnpj["x-rapidapi-key"]
                }
            };                    
            const resp = await fetch(url, header);
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
            const mp = $THIRD_API.Cnpj.mapping 
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
    
    _findCpf(val) {
        window.open('http://servicos.receita.fazenda.gov.br/Servicos/certidao/CndConjuntaInter/InformaNICertidao.asp?Tipo=2&NI=' + val);  
    }

    _validateCnpj() {
        let cnpj = this.valuex;
        if (cnpj === '') return true;

        cnpj = cnpj.replace(/[^\d]+/g, "");
        switch (cnpj) {
            case '00000000000000':
            case '11111111111111':
            case '22222222222222':
            case '33333333333333':
            case '44444444444444':
            case '55555555555555':
            case '66666666666666':
            case '77777777777777':
            case '88888888888888':
            case '99999999999999':
                return false;
            default:
                if (cnpj.length < 14)
                    return false;
        }

        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        else
            return true;
    }

    _validateCpf() {
        let cpf = this.valuex;
        if (cpf === '') return true;
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length < 11 || cpf === '00000000000') return false;

        let soma = 0;
        let resto = 0;
        for (let i = 1; i <= 9; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);

        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(10, 11))) return false;

        return true;
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

customElements.define('x-input-cpf-cnpj', XInputCpfCnpj, { extends: "input" });