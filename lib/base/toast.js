class Toast {
  /**
   * Creates user toast messages
   */
  constructor() { 
    const id = 'x-toast-container__';
    this.toastContainer = document.getElementById(id);
    if (!this.toastContainer) {
      this.toastContainer = this.createToastContainer(id);      
    }
  }

  /**
   * Creates toast container
   * @param {string} id 
   * @returns any
   */
  createToastContainer(id) {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      toast[opened] {
        transform: scale(1);
      }
      
      toast .toast__icon {
          width: 34px;
          font-size: 32px;
          float: left;
      }
      
      toast .toast__close {
          width: 20px;
          padding-right: 25px;
          float: right;
          cursor: pointer;
      }
      
      toast .toast__message {
          float: left;
          width: calc(100% - 64px);
          padding: 10px;
          padding-left: 20px;
          font-size: 16px;    
      }
      
      toast[success] {
          background: var(--x-success-color);
          width :100%;
      }
      
      toast[warning] {
          background: var(--x-warning-color);
      }
      
      toast[error] {
          background: var(--x-error-color);
      }
      
      toast[info] {
          background: var(--x-info-color);
      }
      
      toast[default] {
          background: #333;
          width: 100%;
          font-size:16px;
      }`;

    
    const div = document.createElement('div');
    const style = `
        width: 100%;
        bottom: 0px;
        left: 0px;
        width: 100%;
        z-index: 9999;
        overflow: visible;    
        position: absolute;    
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction:column;
    `;

    div.setAttribute('id', id);
    div.setAttribute('style', style);
    document.body.appendChild(div);
    document.body.appendChild(styleTag);

    return div;
  }

  /**
   * Creates a toast message
   * @param {string} msg 
   * @param {string} cssicon fontawsame
   * @param {*} typ success, error, waring
   * @returns 
   */
  createMessage(msg, cssicon, typ) {
    const html = `
            <toast ${typ}>
                <div class="toast__icon"><i class="${cssicon}"></i></div>
                <div class="toast__message">${msg}</div>                
                <div class="toast__close" onclick="this.parentNode.remove()"><i class="fas fa-times"></i></div>
            </toast>`;
    const temp = document.createElement('template');
    temp.innerHTML = html;
    return temp.content.querySelector('toast');
  }

  show(msg, typ) {
    let t = null;
    switch (typ) {
      case 'error':
        t = this.createMessage(msg, 'fas fa-exclamation-triangle', 'error');        
        break;
      case 'warning':
        t = this.createMessage(msg, 'fas fa-exclamation-triangle', 'warning');        
        break;
      case 'info':
        t = this.createMessage(msg, 'fas fa-info-circle', 'info');        
        break;    
      default:
        if (!msg && !typ)
          t = this.createMessage('Operação realizada com sucesso!','fas fa-check-circle', 'sucesso');
        else
          t = this.createMessage(msg,'fas fa-check-circle', 'sucesso');
        break;
    }
    
    this.toastContainer.appendChild(t);
    setTimeout(() => {
      t.removeAttribute('opened');
      setTimeout(function () { t.remove(); }, 150);
    }, 4000);

    setTimeout(() => {
      t.setAttribute('opened', ' true');
    }, 10);
  }
}