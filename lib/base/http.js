/* eslint-disable no-undef */
class Http {
  constructor() {
    this._token = $CONFIG.userToken;
    this.toast = new Toast();
  }

  async post(url, dataObject, boolShowSuccess) {
    const data = this._getInit(dataObject, 'POST');
    return await this._fetch(url, data, boolShowSuccess);
  }

  async delete(url, dataObject, boolShowSuccess) {
    const data = this._getInit(dataObject, 'DELETE');
    return await this._fetch(url, data, boolShowSuccess);
  }

  async get(url, dataObject = undefined) {
    const data = this._getInit(dataObject, 'GET');
    return await this._fetch(url, data);
  }
  
  async getHtml(url) {
    const _headers = new Headers();
    _headers.append('pragma', 'no-cache');
    _headers.append('cache-control', 'no-cache');
    const resp = await fetch(url, { method: 'GET', headers: _headers }).then(resp => { return resp.text(); });
    return resp;
  }

  async _fetch(url, data, boolShowSuccess) {
    try {
      const resp = await fetch(url, data);
      const json = await resp.json();
      if (json.errors)
        this._parseHttpErrors(json.errors, resp.ok, resp.status);
      else {
        if (boolShowSuccess)
          this.toast.success(undefined);

        return json;
      }
    } catch (ex) {
      const errors = { message: ex.message };
      this._parseHttpErrors(errors, false, -1);
    }

    return undefined;
  }

  _getInit(dataObject, strMethod) {
    const hders = new Headers();
    hders.append('Content-Type', 'application/json');
    hders.append('Authorization', 'Bearer ' + this._token);
    if (dataObject) {
      const jsonBody = JSON.stringify(dataObject);
      return {
        method: strMethod,
        headers: hders,
        body: jsonBody
      };

    } else {
      return {
        method: strMethod,
        headers: hders
      };
    }
  }

  _parseHttpErrors(errors, isOK, status) {
    // definir tratamento de erros
  }
}