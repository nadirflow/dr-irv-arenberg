/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import appleAuth, {
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import moment from 'moment';
/** COMMON */
import { Keys } from '~/config';

const Errors = {
  NOT_SUPPORT: "error_not_support"
}

const Logs = {
  NOT_SUPPORT: "Device not support",
  SIGN_IN_CANCELLED: "ERROR GOOGLE SIGNIN => Login cancelled",
  OTHER: "ERROR GOOGLE SIGNIN => Some other error happened, "
}

export const AsyncAppleSignIn = async () => {
  if (!appleAuth.isSupported) {
    console.log(Logs.NOT_SUPPORT);
    return { code: Errors.NOT_SUPPORT, message: Logs.NOT_SUPPORT };
  }

  try {
    let appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME
      ],
    });

    let { email, fullName } = appleAuthRequestResponse;
    let dataUser = {
      email: email || (fullName.givenName + fullName.familyName + "_" + Keys.LOGIN_SOCIAL_TYPE.APPLE + "@private.com"),
      name: moment().valueOf() + "_" + fullName.givenName + "_" + fullName.familyName
    }
    if (!email) {
      let asDataUserApple = await Helpers.getDataStorage(Keys.AS_DATA_USER_APPLE);
      if (asDataUserApple) {
        dataUser.email = asDataUserApple.email;
        dataUser.name = asDataUserApple.name;
      }
    }

    return dataUser;
  } catch (error) {
    if (error.code === AppleAuthError.CANCELED) {
      console.log(Logs.SIGN_IN_CANCELLED);
    } else {
      console.log(Logs.OTHER, error);
    }
    return null;
  }
}