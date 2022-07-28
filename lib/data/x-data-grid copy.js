class DataGrid extends HTMLTableElement {
    constructor() {
        super();
        this.http = new Http();
        this._data = new Array();
        this._pageStart = 0;
        this._pageEnd = this.pageSize;
        this._loading = false;                
        this._tbody = this.querySelector('tbody');        
    }

    get pageSize() {
        return parseInt(this.getAttribute('page-size'));
    }    
          
    connectedCallback() {
        this.connectFilterBox();
        this.connectInfiniteScroll();
        this.render();
    }

    connectFilterBox() {
        const id = this.getAttribute('filter-box');
        document.getElementById(id).addEventListener('search', (e) => {
            this._loadData(true);
        });
    }

    connectInfiniteScroll() {
        const _this = this;
        this._tbody.addEventListener('scroll', (e) => {
            const row = e.target.children[e.target.children.length - 1];
            const offHeight = this.offsetTop + e.target.offsetHeight;
            const offPos = row.getBoundingClientRect().top + row.getBoundingClientRect().height;

            if (offHeight + 100 > offPos) {
                this._loadData(false);
            }
        });      
    }

    render() {
        this._loadData(true);
    }

    getItem(data) {
        let idx = parseInt(data);
        if (idx > -1) {
            idx = parseInt(idx);
        } else if (data.target) {
            let row = data.target.closest('tr');
            idx = (row) ? row.rowIndex - 1 : -1;
        } else {
            idx = this._data.indexOf(data);
        }

        this._data[idx]._idx = idx;
        return this._data[idx];
    }

    removeItem(data) {
        let idx = parseInt(data);
        if (idx > -1) {
            idx = parseInt(idx);
        } else {
            idx = data._idx || this._data.indexOf(data);
        }

        idx = idx || data._idx;
        this._data.splice(idx, 1);
        const tr = this._tbody.children[idx + 1];
        this._tbody.removeChild(tr);
    }

    updateItem(data, idx) {
        let ii = idx || data._idx || this._data.indexOf(data) || -1;
        if (ii === -1) {            
            this._data.unshift(data);
            ii = 0;
        } else {
            Object.assign(this._data[ii], data);
            this.removeItem(ii);
        }   

        const frag = document.createDocumentFragment();
        this._addRow(data, frag)
        this._tbody.insertBefore(frag, this._tbody.children[ii + 1]);
    }

    async _loadData(resetPagging) {
        if (!this._loading) {
            if (resetPagging) {
                this._pageStart = 0;
                this._pageEnd = this.pageSize;
                this._data = new Array();
                while (this._tbody.children.length > 1)
                    this._tbody.removeChild(this._tbody.children[1]);
            } else {
                this._pageStart = this._pageEnd;
                this._pageEnd += this.pageSize;
            }

            this._setLoading(true);
            const url =  this._getListUrl();
            const list = await this.http.get(url);
            this._data = this._data.concat(list);            
            const fragment = document.createDocumentFragment();
            for (const model of list) {
                this._addRow(model, fragment);
            }

            this._tbody.appendChild(fragment);        
            this._setLoading(false);
        }
    }
    
    _addRow = (model, fragment) => {
        const temp = this._tbody.children[0].innerHTML;

        for (var [key, value] of Object.entries(model)) {
            if (value === null || value === undefined)
                model[key] = '';
        }

        const tds = eval('`' + temp + '`');
        const tr = document.createElement('tr');
        tr.innerHTML = tds;
        fragment.appendChild(tr);
    }
    

    _getListUrl() {
        const filterID = this.getAttribute('filter-box');
        const filterOBJ = document.getElementById(filterID);
        const paramss = filterOBJ ? filterOBJ.getAttribute('filter-value') : '';
        const url = this.getAttribute('url-list');

        return `${url}?pgStart=${this._pageStart}&pgEnd=${this.pageSize}&${paramss}`;
    }    

    _setLoading(active) {
        this._loading = active;
        if (active) {
            const colspan = this.querySelector('tbody tr').children.length;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td cospan="${colspan}" style="text-align:center;padding:10px;border:0px;background:#fff"><i class="fas fa-spinner fa-spin"></i></td>`;
            tr.setAttribute('loader', '');     
            this._tbody.appendChild(tr);
        } else {
            const tr = this._tbody.querySelector('tr[loader]'); 
            if (tr) this._tbody.removeChild(tr);
        }
    }
}

customElements.define('data-grid', DataGrid, { extends: "table" });

