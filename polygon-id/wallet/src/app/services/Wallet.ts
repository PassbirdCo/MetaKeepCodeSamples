// From: https://github.com/0xPolygonID/extension-demo/blob/main/src/services/Wallet.service.js
import { defaultEthConnectionConfig } from "../constants/constants";
import { MetaKeepKeyProvider } from "../MetaKeep/MetaKeepCrypto";

import {
  IdentityStorage,
  CredentialStorage,
  IndexedDBDataSource,
  KmsKeyType,
  IdentityWallet,
  CredentialWallet,
  KMS,
  EthStateStorage,
  MerkleTreeIndexedDBStorage,
  CredentialStatusResolverRegistry,
  CredentialStatusType,
  RHSResolver,
  OnChainResolver,
  IssuerResolver,
  AgentResolver,
  AuthDataPrepareFunc,
  CircuitData,
  DataPrepareHandlerFunc,
  IPackageManager,
  PackageManager,
  PlainPacker,
  ProvingParams,
  StateVerificationFunc,
  VerificationHandlerFunc,
  VerificationParams,
  ZKPPacker,
  ProofService,
  CircuitId,
  AuthHandler,
  FetchHandler,
  IFetchHandler,
  IAuthHandler,
  ICredentialStorage,
  IIdentityStorage,
  IProofService,
  IStateStorage,
  ICredentialWallet,
} from "@0xpolygonid/js-sdk";
import { CircuitStorageInstance } from "./Circuits";
import { proving } from "@iden3/js-jwz";

export class Wallet {
  static async createWallet(email: string): Promise<{
    identityWallet: IdentityWallet;
    credWallet: ICredentialWallet;
    kms: KMS;
    dataStorage: {
      credential: ICredentialStorage;
      identity: IIdentityStorage;
      mt: MerkleTreeIndexedDBStorage;
      states: IStateStorage;
    };
    proofService: IProofService;
    authHandler: IAuthHandler;
    credentialFetchHandler: IFetchHandler;
  }> {
    // Initialize MetaKeep Key Provider
    const metakeepProvider = new MetaKeepKeyProvider(
      process.env.NEXT_PUBLIC_METAKEEP_APP_ID ?? "",
      email
    );
    const kms = new KMS();
    kms.registerKeyProvider(KmsKeyType.BabyJubJub, metakeepProvider);

    // Data Storage
    let dataStorage = {
      credential: new CredentialStorage(
        new IndexedDBDataSource(CredentialStorage.storageKey)
      ),
      identity: new IdentityStorage(
        new IndexedDBDataSource(IdentityStorage.identitiesStorageKey),
        new IndexedDBDataSource(IdentityStorage.profilesStorageKey)
      ),
      mt: new MerkleTreeIndexedDBStorage(40),
      states: new EthStateStorage(defaultEthConnectionConfig[0]),
    };

    // Resolvers
    const resolvers = new CredentialStatusResolverRegistry();
    resolvers.register(
      CredentialStatusType.SparseMerkleTreeProof,
      new IssuerResolver()
    );
    resolvers.register(
      CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      new RHSResolver(dataStorage.states)
    );
    resolvers.register(
      CredentialStatusType.Iden3OnchainSparseMerkleTreeProof2023,
      new OnChainResolver(defaultEthConnectionConfig)
    );
    resolvers.register(
      CredentialStatusType.Iden3commRevocationStatusV1,
      new AgentResolver()
    );

    const credWallet = new CredentialWallet(dataStorage, resolvers);
    let identityWallet = new IdentityWallet(kms, dataStorage, credWallet);

    // Circuit storage
    const circuitStorage = await CircuitStorageInstance.getCircuitStorage();

    // Proof service
    const proofService = new ProofService(
      identityWallet,
      credWallet,
      circuitStorage,
      dataStorage.states,
      { ipfsGatewayURL: "https://ipfs.io" }
    );

    // Package manager
    const pm = await Wallet.initPackageManager(
      await circuitStorage.loadCircuitData(CircuitId.AuthV2),
      proofService.generateAuthV2Inputs.bind(proofService),
      proofService.verifyState.bind(proofService)
    );

    // Auth handler
    const authHandler = new AuthHandler(pm, proofService);

    // Credential fetch handler
    const credentialFetchHandler = new FetchHandler(pm);

    return {
      identityWallet: identityWallet,
      credWallet: credWallet,
      kms: kms,
      dataStorage: dataStorage,
      proofService: proofService,
      authHandler: authHandler,
      credentialFetchHandler: credentialFetchHandler,
    };
  }

  static async initPackageManager(
    circuitData: CircuitData,
    prepareFn: AuthDataPrepareFunc,
    stateVerificationFn: StateVerificationFunc
  ): Promise<IPackageManager> {
    const authInputsHandler = new DataPrepareHandlerFunc(prepareFn);

    const verificationFn = new VerificationHandlerFunc(stateVerificationFn);
    const mapKey =
      proving.provingMethodGroth16AuthV2Instance.methodAlg.toString();
    const verificationParamMap: Map<string, VerificationParams> = new Map([
      [
        mapKey,
        {
          key: circuitData.verificationKey!,
          verificationFn,
        },
      ],
    ]);

    const provingParamMap: Map<string, ProvingParams> = new Map();
    provingParamMap.set(mapKey, {
      dataPreparer: authInputsHandler,
      provingKey: circuitData.provingKey!,
      wasm: circuitData.wasm!,
    });

    const mgr: IPackageManager = new PackageManager();
    const packer = new ZKPPacker(provingParamMap, verificationParamMap);
    const plainPacker = new PlainPacker();
    mgr.registerPackers([packer, plainPacker]);

    return mgr;
  }
}
