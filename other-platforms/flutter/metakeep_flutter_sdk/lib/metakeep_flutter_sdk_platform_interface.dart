import 'package:plugin_platform_interface/plugin_platform_interface.dart';

import 'metakeep_flutter_sdk_method_channel.dart';

abstract class MetakeepFlutterSdkPlatform extends PlatformInterface {
  /// Constructs a MetakeepFlutterSdkPlatform.
  MetakeepFlutterSdkPlatform() : super(token: _token);

  static final Object _token = Object();

  static MetakeepFlutterSdkPlatform _instance = MethodChannelMetakeepFlutterSdk();

  /// The default instance of [MetakeepFlutterSdkPlatform] to use.
  ///
  /// Defaults to [MethodChannelMetakeepFlutterSdk].
  static MetakeepFlutterSdkPlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [MetakeepFlutterSdkPlatform] when
  /// they register themselves.
  static set instance(MetakeepFlutterSdkPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  Future<String?> getPlatformVersion() {
    throw UnimplementedError('platformVersion() has not been implemented.');
  }
}
