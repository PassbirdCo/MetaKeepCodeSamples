import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'metakeep_flutter_sdk_platform_interface.dart';

/// An implementation of [MetakeepFlutterSdkPlatform] that uses method channels.
class MethodChannelMetakeepFlutterSdk extends MetakeepFlutterSdkPlatform {
  /// The method channel used to interact with the native platform.
  @visibleForTesting
  final methodChannel = const MethodChannel('metakeep_flutter_sdk');

  @override
  Future<String?> getPlatformVersion() async {
    final version = await methodChannel.invokeMethod<String>('getPlatformVersion');
    return version;
  }
}
