/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import WooCommerceAPI from '../../WooCommerceAPI';
/** COMMON */
import Routes from '~/services/routes';
import { Configs } from '~/config';

export default {
  jwt: async (params) => {
    try {
      let options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      };

      let results = await fetch(Configs.hostApi + Routes.auth.jwt, options);
      results = results.json();
      return results;
    } catch (error) {
      return null;
    }
  },
  signIn: async (params = {}) => {
    const WooCommerce = new WooCommerceAPI({
      url: Configs.hostApi,
      consumerKey: Configs.cosumerKey,
      consumerSecret: Configs.consumerSecret,
      wpAPI: true,
      version: Configs.versionApiForLogin,
      queryStringAuth: true,
      wpAPIPrefix: Configs.wpAPIPrefixForLogin,
      email : params.email
    });

    try {
      let newURL = Routes.auth.signIn;
      console.log('URL====================================');
      console.log(newURL);
      console.log('URL====================================');
      let results = await WooCommerce.get(newURL , {'email' : params.email});
//wp-json/wc/v3/

      let resultTemp = {
        customer: results[0]
      };
      // console.log('URL====================================');
      
      console.log('URL2====================================');
      console.log(resultTemp );
      console.log('URL2====================================');
      
      return resultTemp;
    } catch (error) {
      return null;
    }
  }
}