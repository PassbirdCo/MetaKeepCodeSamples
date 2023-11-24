import MetaKeep

@objc(MetaKeepReactNativeSDK)
class MetaKeepReactNativeSDK: NSObject {

  @objc(initialize:)
  func initialize(appId: String) -> Any {
    MetaKeepReactNativeSDK.instance = MetaKeep(appId: appId, appContext: AppContext())
    return 0
  }

  @objc(signMessage:withReason:withResolver:withRejecter:)
  func signMessage(
    message: String, reason: String, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    if MetaKeepReactNativeSDK.instance == nil {
      reject("MetaKeep SDK not initialized", "Please call initialize() first", nil)
      return
    }

    MetaKeepReactNativeSDK.instance!.signMessage(
      message: message,
      reason: reason,
      callback: Callback(
        onSuccess: { (result: JsonResponse) in
          print("onSuccess")
          print(result.description)
          resolve(result.data)
        },
        onFailure: { (error: JsonResponse) in
          print("onFailure")
          print(error.description)
          reject(error.description, error.description, nil)
        }
      ))
  }

  // @objc(multiply:withB:withResolver:withRejecter:)
  // func multiply(a: Float, b: Float, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock)
  // {
  //   resolve(a * b)
  // }

  // Singleton that holds the MetaKeep SDK instance
  static var instance: MetaKeep?
}
