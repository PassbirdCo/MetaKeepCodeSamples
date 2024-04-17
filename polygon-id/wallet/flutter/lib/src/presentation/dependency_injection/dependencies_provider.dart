import 'dart:convert';

import 'package:get_it/get_it.dart';
import 'package:polygonid_flutter_sdk/common/domain/entities/env_entity.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/mappers/iden3_message_type_mapper.dart';
import 'package:polygonid_flutter_sdk/identity/data/data_sources/wallet_data_source.dart';
import 'package:polygonid_flutter_sdk/sdk/credential.dart';
import 'package:polygonid_flutter_sdk/sdk/di/injector.dart';
import 'package:polygonid_flutter_sdk/sdk/error_handling.dart';
import 'package:polygonid_flutter_sdk/sdk/iden3comm.dart';
import 'package:polygonid_flutter_sdk/sdk/identity.dart';
import 'package:polygonid_flutter_sdk/sdk/polygon_id_sdk.dart';
import 'package:polygonid_flutter_sdk/sdk/proof.dart';
import 'package:polygonid_flutter_sdk_example/src/common/env.dart';
import 'package:polygonid_flutter_sdk_example/src/metakeep/metakeep_env.dart';
import 'package:polygonid_flutter_sdk_example/src/metakeep/metakeep_crypto.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/auth/auth_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/backup_identity/bloc/backup_identity_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/check_identity_validity/bloc/check_identity_validity_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/claim_detail/bloc/claim_detail_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/claims/claims_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/claims/mappers/claim_model_mapper.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/claims/mappers/claim_model_state_mapper.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/claims/mappers/proof_model_type_mapper.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/home/home_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/restore_identity/bloc/restore_identity_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/sign/sign_bloc.dart';
import 'package:polygonid_flutter_sdk_example/src/presentation/ui/splash/splash_bloc.dart';
import 'package:polygonid_flutter_sdk_example/utils/qr_code_parser_utils.dart';

final getIt = GetIt.instance;

/// Dependency Injection initializer
Future<void> init() async {
  registerEnv();
  await registerProviders();
  registerSplashDependencies();
  registerHomeDependencies();
  registerClaimDetailDependencies();
  registerClaimsDependencies();
  registerAuthDependencies();
  registerMappers();
  registerSignDependencies();
  registerIdentityDependencies();
  registerBackupIdentityDependencies();
  registerRestoreIdentityDependencies();
  registerUtilities();
}

void registerEnv() {
  Map<String, dynamic> defaultEnv = jsonDecode(Env.defaultEnvironment);
  String stacktraceEncryptionKey = Env.stacktraceEncryptionKey;
  String pinataGateway = Env.pinataGateway;
  String pinataGatewayToken = Env.pinataGatewayToken;

  EnvEntity envV1 = EnvEntity.fromJson(defaultEnv);
  if (stacktraceEncryptionKey.isNotEmpty) {
    envV1 = envV1.copyWith(stacktraceEncryptionKey: stacktraceEncryptionKey);
  }

  if (pinataGateway.isNotEmpty) {
    envV1 = envV1.copyWith(pinataGateway: pinataGateway);
  }

  if (pinataGatewayToken.isNotEmpty) {
    envV1 = envV1.copyWith(pinataGatewayToken: pinataGatewayToken);
  }

  getIt.registerSingleton<EnvEntity>(envV1);
}

///
Future<void> registerProviders() async {
  await PolygonIdSdk.init(env: getIt<EnvEntity>());

  // Register MetaKeep wallet provider
  // We unregister the default WalletDataSource and register a new one with MetaKeepWalletLib
  // We then reinitialize the PolygonIdSdk fields with the new WalletDataSource
  getItSdk.get<WalletDataSource>();
  getItSdk.unregister<WalletDataSource>();
  getItSdk.registerSingleton(WalletDataSource(MetaKeepWalletLib(
      MetaKeepEnv.metaKeepAppId,
      // If available, provide the user email here.
      null)));

  await getItSdk.allReady();

  PolygonIdSdk.I.identity = await getItSdk.getAsync<Identity>();
  PolygonIdSdk.I.credential = await getItSdk.getAsync<Credential>();
  PolygonIdSdk.I.proof = await getItSdk.getAsync<Proof>();
  PolygonIdSdk.I.iden3comm = await getItSdk.getAsync<Iden3comm>();
  PolygonIdSdk.I.errorHandling = getItSdk.get<ErrorHandling>();

  getIt.registerLazySingleton<PolygonIdSdk>(() => PolygonIdSdk.I);
}

///
void registerSplashDependencies() {
  getIt.registerFactory(() => SplashBloc());
}

///
void registerHomeDependencies() {
  getIt.registerFactory(() => HomeBloc(getIt()));
}

///
void registerClaimsDependencies() {
  getIt.registerFactory(() => ClaimsBloc(
        getIt(),
        getIt(),
        getIt(),
      ));
}

///
void registerClaimDetailDependencies() {
  getIt.registerFactory(() => ClaimDetailBloc(getIt()));
}

///
void registerAuthDependencies() {
  getIt.registerFactory(() => AuthBloc(getIt(), getIt()));
}

///
void registerMappers() {
  getIt.registerFactory(() => ClaimModelMapper(getIt(), getIt()));
  getIt.registerFactory(() => ClaimModelStateMapper());
  getIt.registerFactory(() => ProofModelTypeMapper());
  getIt.registerFactory(() => Iden3MessageTypeMapper());
}

///
void registerSignDependencies() {
  getIt.registerFactory(() => SignBloc(getIt()));
}

///
void registerIdentityDependencies() {
  getIt.registerFactory<CheckIdentityValidityBloc>(
      () => CheckIdentityValidityBloc(getIt()));
}

///
void registerBackupIdentityDependencies() {
  getIt.registerFactory<BackupIdentityBloc>(() => BackupIdentityBloc(getIt()));
}

///
void registerRestoreIdentityDependencies() {
  getIt
      .registerFactory<RestoreIdentityBloc>(() => RestoreIdentityBloc(getIt()));
}

/// Register utilities
void registerUtilities() {
  getIt.registerLazySingleton<QrcodeParserUtils>(
      () => QrcodeParserUtils(getIt()));
}
