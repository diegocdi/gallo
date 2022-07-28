var XUtils = {
  /**
   * Set value into json paths (obj.obj.obj)
   * @param {any} obj 
   * @param {Array} keyPath 
   * @param {string} value 
   */
   setNestedObject : (obj, keyPath, value) => {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
      const key = keyPath[i];
      if (!(key in obj)) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  },

  /**
   * Get value from json paths (obj.obj.obj)
   * @param {any} obj 
   * @param {Array} keyPath 
   * @returns {any}
   */
  getNestedObject : (obj, keyPath) => {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
      const key = keyPath[i];
      if (!(key in obj)) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    return obj[keyPath[lastKeyIndex]] || '';
  },

  /**
   * Returns value of json string path
   * @param {any} obj 
   * @param {string} strPath 
   * @returns 
   */
  getJsonPathValue : (obj, strPath) => {
    const arr = strPath.split('.');
    return XUtils.getNestedObject(obj, arr);
  }  
}