/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import ApiWP from '~/services/apiWP';
import Routes from '~/services/routes';
import { Configs } from '~/config';

export default {
  list: async (params = {}) => {
    try {
      let newURL = Routes.news.list;
      let tmpArr = Object.entries(params);
      if (tmpArr.length > 0) {
        newURL += "?";
        for (let i = 0; i < tmpArr.length; i++) {
          newURL += tmpArr[i][0] + "=" + tmpArr[i][1];
          if (i !== tmpArr.length) newURL += "&";
        }
      }
      let results = await ApiWP.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  },

  categories: async (params) => {
    try {
      let newURL = Routes.news.categories;;
      if (params) {
        newURL = Routes.news.categories + `?parent=${params.parent}&page=${params.page}&per_page=${params.per_page}`;
      }
      let results = await ApiWP.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  },

  getRelated: async (params) => {
    try {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      };
      let newUrl = Configs.hostApi + Routes.news.related + "/id=" + params.id;
      let results = await fetch(newUrl, options);
      results = results.json();
      return results;
    } catch (error) {
      return null;
    }
  },

  getSubCate: async (params) => {
    try {
      let newURL = Routes.news.categories + `?parent=${params.parent}`;
      let results = await ApiWP.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  },
}