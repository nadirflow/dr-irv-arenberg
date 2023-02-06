/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import { Configs } from '~/config';

export default {
  registry: async (params) => {
    let formData = new FormData();
    formData.append('os', params.os);
    formData.append('token', params.token);

    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    };

    try {
      let res = await fetch(Configs.hostApi + '/pnfw/register', options);
      // console.log('registry Notifiction', res)
    } catch (error) {
      console.log('ERROR ASYNC: ', error);
      return null;
    }
  }
}