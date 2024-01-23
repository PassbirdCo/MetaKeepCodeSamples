import 'package:plugin_platform_interface/plugin_platform_interface.dart';
import 'package:flutter/services.dart';

/// Class that interfaces with the native platform.
class MetakeepFlutterSdkPlatform extends PlatformInterface {
  /// Constructs a MetakeepFlutterSdkPlatform.
  MetakeepFlutterSdkPlatform() : super(token: _token);

  static final Object _token = Object();

  static MetakeepFlutterSdkPlatform _instance = MetakeepFlutterSdkPlatform();

  /// The default instance of [MetakeepFlutterSdkPlatform] to use.
  ///
  /// Defaults to [MetakeepFlutterSdkPlatform].
  static MetakeepFlutterSdkPlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [MetakeepFlutterSdkPlatform] when
  /// they register themselves.
  static set instance(MetakeepFlutterSdkPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  /// The method channel used to interact with the native platform.
  final methodChannel = const MethodChannel('metakeep_flutter_sdk');
}
