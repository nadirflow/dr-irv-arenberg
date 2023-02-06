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

  static get(route) {
    return this.xhr(route, null, 'GET');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT');
  }

  static post(route, params, isFormData) {
    return this.xhr(route, params, 'POST', isFormData);
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE')
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

  static async xhr(route, params, verb, isFormData) {
    let url = Configs.hostApi + '/wp-json' + route;
    if (route && route.search('http') !== -1) {
      url = route;
    }

    let headersFormData = {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
    let options = {
      method: verb,
      headers: isFormData ?headersFormData : ApiWP.headers(),
      body: !params ? null : isFormData ? params : JSON.stringify(params)
    };
    try {
      let resp = await fetch(url, options);
      // console.log('=== Api.xhr.resp ===', resp);
      if (resp.ok) {
        let respJSON = await resp.json();
        // console.log('=== Api.xhr.respJSON ' + route + ' respJSON ===', respJSON);
        return respJSON;
      } else {
        return null;
      }

    } catch (e) {
      // console.log('=== Api.xhr.catch ' + route + ' ===', e);
      return null;
    }
  }
}

export default ApiWP;
