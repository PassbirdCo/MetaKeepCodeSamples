import 'metakeep_flutter_sdk_platform_interface.dart';

class MetaKeep {
  /// Constructs a MetakeepFlutterSdk.
  MetaKeep(String appId) {
    if (appId.isEmpty) {
      throw ArgumentError.value(appId, 'appId', 'appId cannot be empty');
    }

    _initialize(appId);
  }

  /// Initializes the Metakeep SDK.
  Future<void> _initialize(String appId) async {
    await MetakeepFlutterSdkPlatform.instance.methodChannel
        .invokeMethod<void>(initializeMethod, {appIdField: appId});
  }

  /// Sets the user for the Metakeep SDK.
  Future<void> setUser(dynamic user) async {
    await MetakeepFlutterSdkPlatform.instance.methodChannel
        .invokeMethod<void>(setUserMethod, {userField: user});
  }

  /// Signs a message using the Metakeep SDK.
  Future<dynamic> signMessage(String message, String reason) async {
    return await MetakeepFlutterSdkPlatform.instance.methodChannel
        .invokeMethod<dynamic>(signMessageMethod, {
      messageField: message,
      reasonField: reason,
    });
  }

  /// Signs a transaction using the Metakeep SDK.
  Future<dynamic> signTransaction(dynamic transaction, String reason) async {
    return await MetakeepFlutterSdkPlatform.instance.methodChannel
        .invokeMethod<dynamic>(signTransactionMethod, {
      transactionField: transaction,
      reasonField: reason,
    });
  }

  /// Signs typed data using the Metakeep SDK.
  Future<dynamic> signTypedData(dynamic typedData, String reason) async {
    return await MetakeepFlutterSdkPlatform.instance.methodChannel
        .invokeMethod<dynamic>(signTypedDataMethod, {
      typedDataField: typedData,
      reasonField: reason,
    });
  }

  /// Gets the consent token using the Metakeep SDK.
  Future<dynamic> getConsent(String consentToken) async {
    return await MetakeepFlutterSdkPlatform.instance.methodChannel
        .invokeMethod<dynamic>(getConsentMethod, {
      consentTokenField: consentToken,
    });
  }

  /// Gets the wallet using the Metakeep SDK.
  Future<dynamic> getWallet() async {
    return await MetakeepFlutterSdkPlatform.instance.methodChannel
        .invokeMethod<dynamic>(getWalletMethod);
  }

  /// Method constants.
  static const String initializeMethod = 'initialize';
  static const String setUserMethod = 'setUser';
  static const String signMessageMethod = 'signMessage';
  static const String signTransactionMethod = 'signTransaction';
  static const String signTypedDataMethod = 'signTypedData';
  static const String getConsentMethod = 'getConsent';
  static const String getWalletMethod = 'getWallet';

  /// Field constants.
  static const String appIdField = 'appId';
  static const String userField = 'user';
  static const String messageField = 'message';
  static const String transactionField = 'transaction';
  static const String typedDataField = 'typedData';
  static const String reasonField = 'reason';
  static const String consentTokenField = 'consentToken';
}
