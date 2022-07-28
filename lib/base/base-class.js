class BaseClass {
  constructor() {
    this.http = new Http();
    this.toast = new Toast();

    /**
     * @returns {any}
     */
    this.querySelector = (s) => {
      return document.querySelector(s);
    }
  }  
}