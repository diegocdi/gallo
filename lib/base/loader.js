/**
 *  Creates a pure css loader based on https://loading.io/css/
 */
class Loader {
  constructor() {
    this.container = document.createElement('x-loader');
    this.container.innerHTML ='<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';       
    this.container.setAttribute('visible','false');
    document.body.appendChild(this.container);    
  }

  show() {
    this.container.setAttribute('visible','true');
    this.container.setAttribute('style','opacity: 0.1');
    setTimeout(()=> {
      this.container.setAttribute('style','opacity: 1');
    }, 100);
  }

  hide() {    
    setTimeout(()=> { this.container.setAttribute('visible','false'); }, 500);
    setTimeout(()=> { this.container.setAttribute('style','opacity: 0'); }, 1);    
  }
}