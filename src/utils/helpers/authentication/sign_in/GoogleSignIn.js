/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import {
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin';
/** COMMON */
import { Configs } from '~/config';

GoogleSignin.configure({
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: Configs.IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

const Logs = {
  SIGN_IN_CANCELLED: "ERROR GOOGLE SIGNIN => Login cancelled",
  IN_PROGRESS: "ERROR GOOGLE SIGNIN => Login in progress",
  PLAY_SERVICES_NOT_AVAILABLE: "ERROR GOOGLE SIGNIN => Play services not available or outdated",
  OTHER: "ERROR GOOGLE SIGNIN => Some other error happened, "
}

export const AsyncGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const data = await GoogleSignin.signIn();
    return data;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log(Logs.SIGN_IN_CANCELLED);
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log(Logs.IN_PROGRESS);
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(Logs.PLAY_SERVICES_NOT_AVAILABLE);
    } else {
      console.log(Logs.OTHER, error);
    }
    return null;
  }
}