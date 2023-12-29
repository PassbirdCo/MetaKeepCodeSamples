import { Dialog, Transition } from "@headlessui/react";
import { Fragment, use, useEffect, useState } from "react";

import { useAppState } from "./app-state";
import { W3CCredential } from "@0xpolygonid/js-sdk";

export default function ViewCredentials({ onClose }: { onClose: () => void }) {
  const [wallet] = useAppState((state) => [state.wallet]);
  const [credentials, setCredentials] = useState([] as W3CCredential[]);

  useEffect(() => {
    if (credentials.length > 0) return;
    getCredentials();
  });

  const getCredentials = async () => {
    const credentials = await wallet.credWallet.list();
    console.log("Current credentials: ", credentials);
    setCredentials(credentials);
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Credentials
                  </Dialog.Title>

                  {/* Show the credentials list */}

                  <div className="mt-4">
                    {credentials.map((credential, index) => (
                      <div key={index}>
                        <p className="font-semibold">
                          Type:{" "}
                          <span className="font-light">
                            {credential.credentialSubject.type}
                          </span>
                        </p>

                        <p className="font-semibold">
                          Schema:{" "}
                          <span className="font-light">
                            {credential.credentialSchema.id}
                          </span>
                        </p>

                        <p className="font-semibold">
                          Issuer:{" "}
                          <span className="font-light">
                            {credential.issuer}
                          </span>
                        </p>

                        <p className="font-semibold">
                          Issuance date:{" "}
                          <span className="font-light">
                            {credential.issuanceDate}
                          </span>
                        </p>

                        <p className="font-semibold">
                          Subject birthday:{" "}
                          <span className="font-light">
                            {credential.credentialSubject.birthday}
                          </span>
                        </p>

                        <p className="font-semibold">
                          Subject document type:{" "}
                          <span className="font-light">
                            {credential.credentialSubject.documentType}
                          </span>
                        </p>

                        <div className="border-t border-gray-200 my-4"></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
