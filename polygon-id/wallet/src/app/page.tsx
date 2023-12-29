"use client";

import Image from "next/image";
import { useState } from "react";

import { Wallet } from "./services/Wallet";
import {
  core,
  CredentialStatusType,
  KmsKeyType,
  W3CCredential,
  AuthorizationRequestMessage,
  CredentialsOfferMessage,
  StandardJSONCredentialsQueryFilter,
} from "@0xpolygonid/js-sdk";
import { DID } from "@iden3/js-iden3-core";
import { RHS_URL } from "./constants/constants";
import { useAppState } from "./app-state";
import ViewCredentials from "./view-credentials";
import AddCredential from "./add-credential";
import axios from "axios";

export default function Home() {
  const [email, wallet, setWallet] = useAppState((state) => [
    state.email,
    state.wallet,
    state.setWallet,
  ]);
  const [publicKey, setPublicKey] = useState("");
  const [did, setDid] = useState("");
  const [showViewCredentials, setShowViewCredentials] = useState(false);
  const [showAddCredential, setShowAddCredential] = useState(false);
  const [loading, setLoading] = useState(false);

  const createIdentity = async () => {
    try {
      setLoading(true);

      // Create wallet
      const wallet = await Wallet.createWallet(email);
      setWallet(wallet);

      // Get Public Key
      const kmsKeyId = await wallet.identityWallet.generateKey(
        KmsKeyType.BabyJubJub
      );
      setPublicKey(kmsKeyId.id);

      // Create Identity
      let identity = await wallet.identityWallet.createIdentity({
        method: core.DidMethod.PolygonId,
        blockchain: core.Blockchain.Polygon,
        networkId: core.NetworkId.Mumbai,
        revocationOpts: {
          type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
          id: RHS_URL,
        },
      });
      setDid(identity.did.string());

      console.log("Identity created: ", identity);

      return;
    } finally {
      setLoading(false);
    }
  };

  const addCredentialCallback = async (credentialURL: string) => {
    try {
      setLoading(true);

      // Parse credential guid from the credential URL
      // E.g. url: https://issuer-ui.polygonid.me/credentials/issued/689d64e4-a5f1-11ee-93b5-0242ac120009
      const credentialGuid = credentialURL.split("/").pop();

      // Make a call to the issuer to get the credential offer QR code
      // E.g. https://issuer-admin.polygonid.me/v1/credentials/78023d9b-a5c3-11ee-93b5-0242ac120009/qrcode
      const credentialOfferQRCodeLink = (
        await axios.get(
          `https://${process.env.NEXT_PUBLIC_POLYGON_ID_TEST_ISSUER}/v1/credentials/${credentialGuid}/qrcode`
        )
      ).data.qrCodeLink;

      // Parse the request URI from the link embedded in the QR code
      // E.g. "iden3comm://?request_uri=https://issuer-admin.polygonid.me/v1/qr-store?id=35286fb7-0d8b-418d-98c7-18b481abe76c"
      const requestURI = new URL(credentialOfferQRCodeLink).searchParams.get(
        "request_uri"
      );

      // Make a call to the issuer to get the credential offer request
      // E.g. https://issuer-admin.polygonid.me/v1/qr-store?id=35286fb7-0d8b-418d-98c7-18b481abe76c
      const credentialOfferRequest = (await axios.get(requestURI as string))
        .data;

      const credentialOfferRawRequest = new TextEncoder().encode(
        JSON.stringify(credentialOfferRequest)
      );

      // Use the credential offer to get the actual credential
      const credentials =
        await wallet.credentialFetchHandler.handleCredentialOffer(
          credentialOfferRawRequest
        );

      // Add the credential to the wallet
      for (const credential of credentials) {
        await wallet.credWallet.save(credential);
      }

      console.log("Credentials added: ", credentials);
    } finally {
      setLoading(false);
    }
  };

  const createAndVerifyAgeProof = async () => {
    try {
      setLoading(true);

      const authRequest: AuthorizationRequestMessage = {
        id: "5afb5804-5591-4460-b834-a99ec64497ac",
        typ: "application/iden3comm-plain-json",
        type: "https://iden3-communication.io/authorization/1.0/request",
        thid: "5afb5804-5591-4460-b834-a99ec64497ac",
        body: {
          callbackUrl:
            "https://self-hosted-demo-backend-platform.polygonid.me/api/callback?sessionId=453184",
          reason: "test flow",
          scope: [
            {
              id: 1,
              circuitId: "credentialAtomicQuerySigV2",
              query: {
                allowedIssuers: ["*"],
                context:
                  "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
                credentialSubject: {
                  birthday: {
                    $lt: 20000101,
                  },
                },
                type: "KYCAgeCredential",
              },
            },
          ],
        },
        from: "did:polygonid:polygon:mumbai:2qH7TstpRRJHXNN4o49Fu9H2Qismku8hQeUxDVrjqT",
      };

      console.log("Authorization request: ", authRequest);

      const authRequestRaw = new TextEncoder().encode(
        JSON.stringify(authRequest)
      );

      // Handle the authorization request to generate the age proof
      console.time("Generating age proof");

      const authResponse = await wallet.authHandler.handleAuthorizationRequest(
        DID.parse(did),
        authRequestRaw
      );

      console.timeEnd("Generating age proof");

      console.log("Authorization response: ", authResponse);

      // Verify the age proof
      console.time("Verifying age proof");
      const verified = await wallet.proofService.verifyProof(
        {
          proof: authResponse.authResponse.body.scope[0].proof,
          pub_signals: authResponse.authResponse.body.scope[0].pub_signals,
        },
        authResponse.authResponse.body.scope[0].circuitId
      );

      console.timeEnd("Verifying age proof");

      console.log("Age proof verified: ", verified);

      if (!verified) {
        throw new Error("Age proof verification failed");
      }

      // Handle the callback URL to submit the  proof
      await wallet.authHandler.verifyAuthorizationResponse(authResponse);
    } finally {
      setLoading(false);
    }
  };

  const viewCredentials = async () => {
    setShowViewCredentials(true);
  };

  const addCredential = async () => {
    setShowAddCredential(true);
  };

  return loading ? (
    <Loader />
  ) : (
    <main className="flex min-h-screen flex-col gap-10 justify-normal items-center p-3">
      {/* Header */}
      <header className="flex items-start w-full h-20">
        <Image
          src="/metakeep-cryptography-light.png"
          alt="MetaKeep Cryptography Logo"
          width={180}
          height={37}
          priority
        />
        <div className={`mb-4 text-2xl self-center `}>Polygon Id</div>
      </header>

      {/* Textbox asking users to enter their email */}
      <UserInfo />

      {/* DID */}
      <p className="text-2xl font-semibold">
        DID: <span className="font-light">{did ? did : "UNKNOWN"}</span>
        <br />
        Public Key:{" "}
        <span className="font-light">{publicKey ? publicKey : "UNKNOWN"}</span>
      </p>

      {/* Action buttons */}
      {email && (
        <div className="flex items-center justify-between items-center space-x-4 place-content-center content-center h-20">
          {/*  Create Identity Button */}
          {!did && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={createIdentity}
            >
              Create Identity
            </button>
          )}

          {/*  View Credentials Button */}
          {did && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={viewCredentials}
            >
              View Credentials
            </button>
          )}

          {/*  Add Credential Button */}
          {did && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={addCredential}
            >
              Add KYC Age Credential
            </button>
          )}

          {/*  Create & Verify Age Proof Button */}
          {did && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={createAndVerifyAgeProof}
            >
              Create & Verify Age Proof
            </button>
          )}
        </div>
      )}

      {showViewCredentials && (
        <ViewCredentials onClose={() => setShowViewCredentials(false)} />
      )}

      {showAddCredential && (
        <AddCredential
          onAdd={async (credentialURL: string) => {
            setShowAddCredential(false);
            await addCredentialCallback(credentialURL);
          }}
        />
      )}

      {/* Main content */}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"></div>
      </div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
    </main>
  );
}

// Email input component
//

const UserInfo = () => {
  const [email, setEmail] = useAppState((state) => [
    state.email,
    state.setEmail,
  ]);
  const [emailFormValue, setEmailFormValue] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFormValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail(emailFormValue);
  };

  return email ? (
    <div className="flex items-center justify-between items-center space-x-4 place-content-center content-center h-20">
      <p className="text-2xl font-semibold">
        Email address: <span className="font-light">{email}</span>
      </p>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between items-center space-x-4 place-content-center content-center h-20"
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={emailFormValue}
        onChange={handleEmailChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="email"
        name="email"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

// Full screen loader
const Loader = () => {
  return (
    <div className="absolute flex items-center justify-center w-full h-full bg-slate-400/20 z-50">
      <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
        <svg
          fill="none"
          className="w-12 h-12 animate-spin"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>

        <div className="text-2xl font-semibold">Processing ...</div>
      </div>
    </div>
  );
};
