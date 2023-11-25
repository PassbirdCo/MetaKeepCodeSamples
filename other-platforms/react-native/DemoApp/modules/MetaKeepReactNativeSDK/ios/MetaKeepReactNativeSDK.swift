import MetaKeep

@objc(MetaKeepReactNativeSDK)
class MetaKeepReactNativeSDK: NSObject {

  @objc(initialize:)
  func initialize(appId: String) -> Any {
    MetaKeepReactNativeSDK.instance = MetaKeep(appId: appId, appContext: AppContext())
    return 0
  }

  @objc(setUser:)
  func setUser(user: NSDictionary) -> Any {
    // Only email is supported for now
    if user["email"] == nil {
      return 0
    }

    MetaKeepReactNativeSDK.instance!.user =
      User(
        email: user["email"] as! String
      )

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
      callback: MetaKeepReactNativeSDK.getCallback(resolve: resolve, reject: reject))
  }

  @objc(signTransaction:withReason:withResolver:withRejecter:)
  func signTransaction(
    transaction: NSDictionary, reason: String, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    if MetaKeepReactNativeSDK.instance == nil {
      reject("MetaKeep SDK not initialized", "Please call initialize() first", nil)
      return
    }

    do {

      MetaKeepReactNativeSDK.instance!.signTransaction(
        transaction: try MetaKeepReactNativeSDK.NSDictionaryToJsonRequest(dictionary: transaction),
        reason: reason,
        callback: MetaKeepReactNativeSDK.getCallback(resolve: resolve, reject: reject))
    } catch {
      reject("INVALID_TRANSACTION", "Invalid transaction", error)
    }

  }

  @objc(signTypedData:withReason:withResolver:withRejecter:)
  func signTypedData(
    typedData: NSDictionary, reason: String, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    if MetaKeepReactNativeSDK.instance == nil {
      reject("MetaKeep SDK not initialized", "Please call initialize() first", nil)
      return
    }

    do {
      MetaKeepReactNativeSDK.instance!.signTypedData(
        typedData: try MetaKeepReactNativeSDK.NSDictionaryToJsonRequest(dictionary: typedData),
        reason: reason,
        callback: MetaKeepReactNativeSDK.getCallback(resolve: resolve, reject: reject))
    } catch {
      reject("INVALID_TYPED_DATA", "Invalid typed data", error)
    }
  }

  @objc(getConsent:withResolver:withRejecter:)
  func getConsent(
    consentToken: String, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    if MetaKeepReactNativeSDK.instance == nil {
      reject("MetaKeep SDK not initialized", "Please call initialize() first", nil)
      return
    }

    MetaKeepReactNativeSDK.instance!.getConsent(
      consentToken: consentToken,
      callback: MetaKeepReactNativeSDK.getCallback(resolve: resolve, reject: reject))
  }

  static private func getCallback(
    resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock
  ) -> Callback {
    return Callback(
      onSuccess: { (result: JsonResponse) in
        resolve(result.data)
      },
      onFailure: { (error: JsonResponse) in
        reject(
          "OPERATION_FAILED", "MetaKeep SDK operation failed",
          NSError(
            domain: "MetaKeep", code: -1, userInfo: error.data as NSDictionary? as? [String: Any])
        )
      }
    )
  }

  static private func NSDictionaryToJsonRequest(dictionary: NSDictionary) throws -> JsonRequest {
    print(dictionary.description)
    let jsonString = String(
      bytes: try JSONSerialization.data(withJSONObject: dictionary), encoding: .utf8)!
    return try JsonRequest(jsonString: jsonString)
  }

  // Singleton that holds the MetaKeep SDK instance
  static var instance: MetaKeep?
}
