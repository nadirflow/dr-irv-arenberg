/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/** COMMON */
import { Configs } from '~/config';

class ApiWP {

  static headers() {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    return headers;
  }

  static get(route, version = 'v2') {
    return this.xhr(route, null, 'GET', version);
  }

  static put(route, params, version = 'v2') {
    return this.xhr(route, params, 'PUT', version);
  }

  static post(route, params, version = 'v2') {
    return this.xhr(route, params, 'POST', version);
  }

  static delete(route, params, version = 'v2') {
    return this.xhr(route, params, 'DELETE', version)
  }

  static async upload(route, params, version = 'v2') {
    let url = Configs.hostApi + '/wp-json/wp/' + version + route;
    if (route.search('http') !== -1) {
      url = route;
    }
    let _avatarUpload = new FormData();
    _avatarUpload.append('file', {
      uri: params.uri,
      type: 'image/jpeg', // or file.type
      name: params.uri.split('/').pop()
    });

    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + ""
      },
      body: _avatarUpload
    };

    try {
      let resp = await fetch(url, options);
      // console.log('=== Api.xhr.resp ' + route + ' respJSON ===', resp);
      if (resp.ok) {
        let respJSON = await resp.json();
        return respJSON;
      } else return null;
    } catch (e) {
      // console.log('=== Api.xhr.catch ' + route + ' ===', e);
      return null;
    }
  }

  static async xhr(route, params, verb, version = 'v2') {
    let url = Configs.hostApi + '/wp-json/wp/' + version + route;
    if (route && route.search('http') !== -1) {
      url = route;
    }

    let options = {
      method: verb,
      headers: ApiWP.headers(),
      body: params ? JSON.stringify(params) : null
    };
    try {
      let resp = await fetch(url, options);
      // console.log('=== Api.xhr.resp ===', resp);
      if (resp.ok) {
        let respJSON = await resp.json();
        // console.log('=== Api.xhr.respJSON ' + route + ' respJSON ===', respJSON);
        return respJSON;
      } else {
        if (respJSON) {
          return respJSON;
        } else {
          return null;
        }
      }

    } catch (e) {
      console.log('=== Api.xhr.catch ' + route + ' ===', e);
      return null;
    }
  }
}

export default ApiWP;
