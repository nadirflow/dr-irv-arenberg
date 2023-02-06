/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
/** COMMON */
import { Configs } from '~/config';

const Logs = {
  SIGN_IN_CANCELLED: "ERROR FACEBOOK SIGNIN => Login cancelled",
  OTHER: "ERROR FACEBOOK SIGNIN => Some other error happened, "
}

export const AsyncFacebookSignIn = async ({
  funcCallback = () => { }
}) => {
  let result = await LoginManager.logInWithPermissions(Configs.PERMISSIONS_LOGIN_FB);
  if (result) {
    if (result.isCancelled) {
      console.log(Logs.SIGN_IN_CANCELLED);
      return null;
    } else {
      let infoRequest = new GraphRequest(
        '/me?fields=' + Configs.INFO_NEED_FB,
        null,
        funcCallback
      );
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start();
    }
  } else {
    console.log(Logs.OTHER);
    return null;
  }
}