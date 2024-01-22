
import 'metakeep_flutter_sdk_platform_interface.dart';

class MetakeepFlutterSdk {
  Future<String?> getPlatformVersion() {
    return MetakeepFlutterSdkPlatform.instance.getPlatformVersion();
  }
}
