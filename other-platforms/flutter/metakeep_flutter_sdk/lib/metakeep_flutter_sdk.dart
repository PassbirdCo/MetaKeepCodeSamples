import 'metakeep_flutter_sdk_platform_interface.dart';

class Metakeep {
  /// Constructs a MetakeepFlutterSdk.
  Metakeep(String appId) {
    if (appId.isEmpty) {
      throw ArgumentError.value(appId, 'appId', 'appId cannot be empty');
    }

    MetakeepFlutterSdkPlatform.instance.initialize(appId);
  }
}
