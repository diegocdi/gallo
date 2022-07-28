/**
 * Replace string
 * @param {string} r 
 * @param {string} w 
 */
String.prototype.replaceAll = function (r, w) {
  var s = this;
  try {
    return s.split(r).join(w);
  } catch (e) {
    return s;
  }
};

/**
 * Removes formats chars from string
 */
String.prototype.unformat = function () {
  return this.replace(/\.|\-|\,|\=|\)|\(/g, '').replaceAll('/', '');
};

/**
 * Toggle class
 * @param {string} className 
 */
HTMLElement.prototype.toggleClass = function (className) {
  if (this.className.indexOf(className) > -1) {
    this.classList.remove(className);
  } else {
    this.classList.add(className);
  }
};

HTMLDocument.prototype.createFromHTML = function(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.children[0];
};

