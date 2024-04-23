import 'dart:convert';

import 'package:get_it/get_it.dart';
import 'package:polygonid_flutter_sdk/common/domain/entities/env_entity.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/data_sources/iden3_message_data_source.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/data_sources/lib_pidcore_iden3comm_data_source.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/data_sources/remote_iden3comm_data_source.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/mappers/auth_inputs_mapper.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/mappers/auth_proof_mapper.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/mappers/auth_response_mapper.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/mappers/iden3_message_type_mapper.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/mappers/iden3comm_proof_mapper.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/mappers/jwz_mapper.dart';
import 'package:polygonid_flutter_sdk/iden3comm/data/repositories/iden3comm_repository_impl.dart';
import 'package:polygonid_flutter_sdk/iden3comm/domain/entities/authorization/request/auth_request_iden3_message_entity.dart';
import 'package:polygonid_flutter_sdk/iden3comm/domain/entities/common/iden3_message_entity.dart';
import 'package:polygonid_flutter_sdk/iden3comm/domain/exceptions/iden3comm_exceptions.dart';
import 'package:polygonid_flutter_sdk/iden3comm/domain/repositories/iden3comm_repository.dart';
import 'package:polygonid_flutter_sdk/iden3comm/domain/use_cases/get_iden3message_use_case.dart';
import 'package:polygonid_flutter_sdk/identity/data/data_sources/lib_babyjubjub_data_source.dart';
import 'package:polygonid_flutter_sdk/identity/data/data_sources/wallet_data_source.dart';
import 'package:polygonid_flutter_sdk/identity/data/mappers/q_mapper.dart';
import 'package:polygonid_flutter_sdk/proof/data/mappers/gist_mtproof_mapper.dart';
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

  // Register the patched Iden3commRepository
  // The default implementation of the authenticate method in the SDK is broken
  getItSdk.unregister<Iden3commRepository>();
  getItSdk.registerFactory<Iden3commRepository>(
      () => PatchedIden3commRepositoryImpl(
            getItSdk.get<Iden3MessageDataSource>(),
            getItSdk.get<RemoteIden3commDataSource>(),
            getItSdk.get<LibPolygonIdCoreIden3commDataSource>(),
            getItSdk.get<LibBabyJubJubDataSource>(),
            getItSdk.get<AuthResponseMapper>(),
            getItSdk.get<AuthInputsMapper>(),
            getItSdk.get<AuthProofMapper>(),
            getItSdk.get<GistMTProofMapper>(),
            getItSdk.get<QMapper>(),
            getItSdk.get<JWZMapper>(),
            getItSdk.get<Iden3commProofMapper>(),
            getItSdk.get<GetIden3MessageUseCase>(),
            getItSdk.get<RemoteIden3commDataSource>(),
            getItSdk.get<GetIden3MessageUseCase>(),
          ));

  await getItSdk.allReady();

  // Reinitialize the PolygonIdSdk fields with the new implementations
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

/// Patched Iden3commRepository implementation
class PatchedIden3commRepositoryImpl extends Iden3commRepositoryImpl {
  final RemoteIden3commDataSource _remoteIden3commDataSource;
  final GetIden3MessageUseCase _getIden3MessageUseCase;

  PatchedIden3commRepositoryImpl(
      super.iden3messageDataSource,
      super.remoteIden3commDataSource,
      super.libPolygonIdCoreIden3commDataSource,
      super.libBabyJubJubDataSource,
      super.authResponseMapper,
      super.authInputsMapper,
      super.authProofMapper,
      super.gistProofMapper,
      super.qMapper,
      super.jwzMapper,
      super.iden3commProofMapper,
      super.getIden3MessageUseCase,
      this._remoteIden3commDataSource,
      this._getIden3MessageUseCase);

  /// The default implementation of the authenticate method in the SDK is broken
  /// with a failing JSON parsing. This patched implementation fixes the issue.
  @override
  Future<Iden3MessageEntity?> authenticate({
    required AuthIden3MessageEntity request,
    required String authToken,
  }) async {
    String? url = request.body.callbackUrl;

    if (url == null || url.isEmpty) {
      throw NullAuthenticateCallbackException(request);
    }

    final response = await _remoteIden3commDataSource.authWithToken(
      token: authToken,
      url: url,
    );

    if (response.data.isEmpty) {
      return null;
    }

    final messageJson = jsonDecode(response.toString());
    if (messageJson is! Map<String, dynamic> || messageJson.isEmpty) {
      return null;
    }

    try {
      final nextRequest = await _getIden3MessageUseCase.execute(
        param: jsonEncode(messageJson),
      );

      return nextRequest;
    } catch (e) {
      return null;
    }
  }
}
