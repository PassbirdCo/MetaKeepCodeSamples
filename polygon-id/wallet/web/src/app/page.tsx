"use client";

import Image from "next/image";
import { useState } from "react";

import { Wallet } from "./services/Wallet";
import { core, CredentialStatusType, KmsKeyType } from "@0xpolygonid/js-sdk";
import { DID } from "@iden3/js-iden3-core";
import { RHS_URL } from "./constants/constants";
import { useAppState } from "./app-state";
import ViewCredentials from "./view-credentials";
import QRScanner from "./qr-scanner";
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
  const [showCreateAndVerifyAgeProof, setShowCreateAndVerifyAgeProof] =
    useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
        networkId: core.NetworkId.Amoy,
        revocationOpts: {
          type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
          id: RHS_URL,
        },
      });
      setDid(identity.did.string());

      console.log("Identity created: ", identity);

      setToastMessage("Identity created successfully.");
      return;
    } catch (e: any) {
      setToastMessage(
        "Error creating identity: " + (e.status ? e.status : e.message)
      );
      console.error("Error creating identity: ", e);
    } finally {
      setLoading(false);
    }
  };

  const addCredential = async (credentialQRCode: string) => {
    try {
      setLoading(true);

      if (!credentialQRCode) {
        return;
      }

      // Parse the request URI from the link embedded in the QR code
      // E.g. "iden3comm://?request_uri=https://issuer-admin.polygonid.me/v1/qr-store?id=35286fb7-0d8b-418d-98c7-18b481abe76c"
      const requestURI = new URL(credentialQRCode).searchParams.get(
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
      await wallet.credWallet.saveAll(credentials);

      console.log("Credentials added: ", credentials);

      setToastMessage("Credential added successfully.");

      return;
    } catch (e: any) {
      setToastMessage(
        "Error adding credential: " + (e.status ? e.status : e.message)
      );
      console.error("Error adding credential: ", e);
    } finally {
      setLoading(false);
    }
  };

  const createAndVerifyAgeProof = async (authRequestQRCode: string) => {
    try {
      setLoading(true);

      const authRequest = JSON.parse(authRequestQRCode);

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

      // Handle the callback URL to submit the proof
      const callbackResponse = await axios.post(
        `${authRequest.body.callbackUrl}`,
        authResponse.token,
        {
          headers: {
            "Content-Type": "text/plain",
          },
          responseType: "json",
        }
      );

      console.log("Callback response: ", callbackResponse.data);

      setToastMessage("Age proof created and verified successfully.");

      return;
    } catch (e: any) {
      setToastMessage(
        "Error creating and verifying age proof: " +
          (e.status ? e.status : e.message)
      );
      console.error("Error creating and verifying age proof: ", e);
    } finally {
      setLoading(false);
    }
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

      {/* DID and public key */}
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
              onClick={() => setShowViewCredentials(true)}
            >
              View Credentials
            </button>
          )}

          {/*  Add Credential Button */}
          {did && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={() => setShowAddCredential(true)}
            >
              Add KYC Age Credential
            </button>
          )}

          {/*  Create & Verify Age Proof Button */}
          {did && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={() => setShowCreateAndVerifyAgeProof(true)}
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
        <QRScanner
          onScan={async (credentialQRCode: string) => {
            setShowAddCredential(false);
            await addCredential(credentialQRCode);
          }}
        />
      )}

      {showCreateAndVerifyAgeProof && (
        <QRScanner
          onScan={async (authRequestQRCode: string) => {
            setShowCreateAndVerifyAgeProof(false);
            await createAndVerifyAgeProof(authRequestQRCode);
          }}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
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

// Toast
const Toast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div
      id="toast-success"
      className="fixed right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      {!message.includes("Error") && (
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
      )}

      {message.includes("Error") && (
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
          <span className="sr-only">Error icon</span>
        </div>
      )}

      <div className="ms-3 text-sm font-normal"> {message} </div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-success"
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};
