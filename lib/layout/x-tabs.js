class XTabs extends HTMLElement {
  constructor() {
    super();
    this._tabs = [];
  }

  connectedCallback() {
    if (!this.getAttribute('upgraded')) {
      this.setAttribute('upgraded', '');
      this._tabs = Array.from(this.querySelectorAll('li[tab-control]'));
      for(let i = 0; i < this._tabs.length; i++) {
        this._tabs[i].setAttribute('idx', i);
        this._tabs[i].addEventListener('click', (evt) => {
          this._handleClick(evt.target);          
        });
      }
    }
  }

  _handleClick(sender) {
    const senderIDX = sender.getAttribute('idx');
    const senderTab = sender.getAttribute('tab-control');
    sender.setAttribute('active','');
    document.getElementById(senderTab).setAttribute('visible','true');
    
    for(let i = 0; i < this._tabs.length; i++) {
      const tc = this._tabs[i].getAttribute('tab-control');
      const idx = this._tabs[i].getAttribute('idx');
      if (idx != senderIDX) {
        const ctrl = document.getElementById(tc);
        ctrl.setAttribute('visible', 'false');
        this._tabs[i].removeAttribute('active');
      }
    }
  }
}
customElements.define('x-tabs', XTabs);
