import {NativeModules, Platform} from 'react-native';

const LINKING_ERROR =
  "The package 'metakeep-react-native-sdk' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const MetaKeepReactNativeSDK = NativeModules.MetaKeepReactNativeSDK
  ? NativeModules.MetaKeepReactNativeSDK
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

// Create a static class that exports native module methods
class MetaKeep {
  static initialize(appId) {
    return MetaKeepReactNativeSDK.initialize(appId);
  }

  static async signMessage(message, reason): Promise<object> {
    return await MetaKeepReactNativeSDK.signMessage(message, reason);
  }
}

export default MetaKeep;
