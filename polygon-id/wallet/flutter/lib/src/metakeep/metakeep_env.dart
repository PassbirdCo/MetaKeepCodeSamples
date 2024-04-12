import 'package:envied/envied.dart';

part 'metakeep_env.g.dart';

@Envied()
abstract class MetaKeepEnv {
  @EnviedField(varName: 'METAKEEP_APP_ID')
  static const String metaKeepAppId = _MetaKeepEnv.metaKeepAppId;
}
