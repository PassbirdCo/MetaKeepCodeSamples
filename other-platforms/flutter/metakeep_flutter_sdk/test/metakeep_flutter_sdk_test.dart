import 'package:flutter_test/flutter_test.dart';
import 'package:metakeep_flutter_sdk/metakeep_flutter_sdk.dart';
import 'package:metakeep_flutter_sdk/metakeep_flutter_sdk_platform_interface.dart';
import 'package:metakeep_flutter_sdk/metakeep_flutter_sdk_method_channel.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class MockMetakeepFlutterSdkPlatform
    with MockPlatformInterfaceMixin
    implements MetakeepFlutterSdkPlatform {

  @override
  Future<String?> getPlatformVersion() => Future.value('42');
}

void main() {
  final MetakeepFlutterSdkPlatform initialPlatform = MetakeepFlutterSdkPlatform.instance;

  test('$MethodChannelMetakeepFlutterSdk is the default instance', () {
    expect(initialPlatform, isInstanceOf<MethodChannelMetakeepFlutterSdk>());
  });

  test('getPlatformVersion', () async {
    MetakeepFlutterSdk metakeepFlutterSdkPlugin = MetakeepFlutterSdk();
    MockMetakeepFlutterSdkPlatform fakePlatform = MockMetakeepFlutterSdkPlatform();
    MetakeepFlutterSdkPlatform.instance = fakePlatform;

    expect(await metakeepFlutterSdkPlugin.getPlatformVersion(), '42');
  });
}
