"use client";
import {
  IAuthHandler,
  ICredentialStorage,
  ICredentialWallet,
  IFetchHandler,
  IIdentityStorage,
  IMerkleTreeStorage,
  IProofService,
  IStateStorage,
  IdentityWallet,
  KMS,
} from "@0xpolygonid/js-sdk";
import { create } from "zustand";

interface AppState {
  // Email of the user
  email: string;
  setEmail: (email: string) => void;

  // Wallet
  wallet: {
    identityWallet: IdentityWallet;
    credWallet: ICredentialWallet;
    kms: KMS;
    dataStorage: {
      credential: ICredentialStorage;
      identity: IIdentityStorage;
      mt: IMerkleTreeStorage;
      states: IStateStorage;
    };
    proofService: IProofService;
    authHandler: IAuthHandler;
    credentialFetchHandler: IFetchHandler;
  };
  setWallet: (wallet: AppState["wallet"]) => void;
}

export const useAppState = create<AppState>()((set) => ({
  email: "",
  setEmail: (email: string) => set({ email }),

  wallet: {} as AppState["wallet"],
  setWallet: (wallet: AppState["wallet"]) => set({ wallet }),
}));
