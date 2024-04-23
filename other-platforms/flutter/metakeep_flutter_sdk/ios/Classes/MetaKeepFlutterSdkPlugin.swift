import Flutter
import MetaKeep
import UIKit

public class MetaKeepFlutterSdkPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(
      name: "metakeep_flutter_sdk", binaryMessenger: registrar.messenger())
    let instance = MetaKeepFlutterSdkPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case INITIALIZE_METHOD:
      return initialize(call, result: result)
    case SET_USER_METHOD:
      return setUser(call, result: result)
    case SIGN_MESSAGE_METHOD:
      return signMessage(call, result: result)
    case SIGN_TRANSACTION_METHOD:
      return signTransaction(call, result: result)
    case SIGN_TYPED_DATA_METHOD:
      return signTypedData(call, result: result)
    case GET_CONSENT_METHOD:
      return getConsent(call, result: result)
    case GET_WALLET_METHOD:
      return getWallet(call, result: result)
    default:
      result(FlutterMethodNotImplemented)
    }
  }

  func initialize(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    guard let args = call.arguments as? [String: Any],
      let appId = args[APP_ID_FIELD] as? String
    else {
      return rejectWithErrorStatus(errorStatus: INVALID_ARGUMENTS_ERROR_STATUS, result: result)
    }
    sdk = MetaKeep(appId: appId, appContext: AppContext())
    result(nil)
  }

  func setUser(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    // Only email is supported for now
    guard let args = call.arguments as? [String: Any],
      let user = args[USER_FIELD] as? [String: Any],
      let email = user[EMAIL_FIELD] as? String
    else {
      return rejectWithErrorStatus(errorStatus: INVALID_USER_ERROR_STATUS, result: result)
    }

    sdk!.user =
      User(
        email: email
      )
  }

  func signMessage(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    guard let args = call.arguments as? [String: Any],
      let message = args[MESSAGE_FIELD] as? String,
      let reason = args[REASON_FIELD] as? String
    else {
      return rejectWithErrorStatus(errorStatus: INVALID_ARGUMENTS_ERROR_STATUS, result: result)
    }

    sdk!.signMessage(
      message: message,
      reason: reason,
      callback: getCallback(result))
  }

  func signTransaction(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    guard let args = call.arguments as? [String: Any],
      let transaction = args[TRANSACTION_FIELD] as? NSDictionary,
      let reason = args[REASON_FIELD] as? String
    else {
      return rejectWithErrorStatus(errorStatus: INVALID_ARGUMENTS_ERROR_STATUS, result: result)
    }

    do {
      sdk!.signTransaction(
        transaction: try NSDictionaryToJsonRequest(dictionary: transaction as NSDictionary),
        reason: reason,
        callback: getCallback(result))
    } catch {
      rejectWithErrorStatus(errorStatus: INVALID_TRANSACTION_ERROR_STATUS, result: result)
    }
  }

  func signTypedData(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    guard let args = call.arguments as? [String: Any],
      let typedData = args[TYPED_DATA_FIELD] as? NSDictionary,
      let reason = args[REASON_FIELD] as? String
    else {
      return rejectWithErrorStatus(errorStatus: INVALID_ARGUMENTS_ERROR_STATUS, result: result)
    }

    do {
      sdk!.signTypedData(
        typedData: try NSDictionaryToJsonRequest(dictionary: typedData),
        reason: reason,
        callback: getCallback(result))
    } catch {
      rejectWithErrorStatus(errorStatus: INVALID_TYPED_DATA_ERROR_STATUS, result: result)
    }
  }

  func getConsent(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    guard let args = call.arguments as? [String: Any],
      let consentToken = args[CONSENT_TOKEN_FIELD] as? String
    else {
      return rejectWithErrorStatus(errorStatus: INVALID_ARGUMENTS_ERROR_STATUS, result: result)
    }

    sdk!.getConsent(
      consentToken: consentToken,
      callback: getCallback(result))
  }

  func getWallet(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    sdk!.getWallet(
      callback: getCallback(result))
  }

  private func getCallback(_ result: @escaping FlutterResult) -> Callback {
    return Callback(
      onSuccess: { (response: JsonResponse) in
        result(response.data)
      },
      onFailure: { (error: JsonResponse) in
        result(
          FlutterError(
            // Pack the actual JSON error response into the error details
            // so that the caller can access it.
            code: self.OPERATION_FAILED_ERROR_STATUS, message: self.OPERATION_FAILED_ERROR_STRING,
            details: error.data
          ))
      }
    )
  }

  private func NSDictionaryToJsonRequest(dictionary: NSDictionary) throws -> JsonRequest {
    let jsonString = String(
      bytes: try JSONSerialization.data(withJSONObject: dictionary), encoding: .utf8)!
    return try JsonRequest(jsonString: jsonString)
  }

  private func rejectWithErrorStatus(errorStatus: String, result: @escaping FlutterResult) {
    result(
      FlutterError(
        code: self.OPERATION_FAILED_ERROR_STATUS, message: OPERATION_FAILED_ERROR_STRING,
        details: [STATUS_FIELD: errorStatus]
      ))
  }

  // Holds the MetaKeep SDK instance
  private var sdk: MetaKeep?

  // Methods
  private let INITIALIZE_METHOD = "initialize"
  private let SET_USER_METHOD = "setUser"
  private let SIGN_MESSAGE_METHOD = "signMessage"
  private let SIGN_TRANSACTION_METHOD = "signTransaction"
  private let SIGN_TYPED_DATA_METHOD = "signTypedData"
  private let GET_CONSENT_METHOD = "getConsent"
  private let GET_WALLET_METHOD = "getWallet"

  // Error status
  private let INVALID_ARGUMENTS_ERROR_STATUS = "INVALID_ARGUMENTS"
  private let INVALID_USER_ERROR_STATUS = "INVALID_USER"
  private let INVALID_TRANSACTION_ERROR_STATUS = "INVALID_TRANSACTION"
  private let INVALID_TYPED_DATA_ERROR_STATUS = "INVALID_TYPED_DATA"
  private let OPERATION_FAILED_ERROR_STATUS = "OPERATION_FAILED"

  // Error strings
  private let OPERATION_FAILED_ERROR_STRING = "MetaKeep SDK operation failed"

  // Constant strings
  private let METAKEEP_DOMAIN = "MetaKeep"
  private let APP_ID_FIELD = "appId"
  private let USER_FIELD = "user"
  private let EMAIL_FIELD = "email"
  private let MESSAGE_FIELD = "message"
  private let TRANSACTION_FIELD = "transaction"
  private let TYPED_DATA_FIELD = "typedData"
  private let REASON_FIELD = "reason"
  private let STATUS_FIELD = "status"
  private let CONSENT_TOKEN_FIELD = "consentToken"
}
