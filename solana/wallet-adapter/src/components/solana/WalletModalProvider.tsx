// Adapted from official solana wallet adapter react UI package: https://github.com/anza-xyz/wallet-adapter/blob/master/packages/ui/react-ui/src/WalletModalProvider.tsx
import type { FC, ReactNode } from "react";
import React, { useState } from "react";
import { WalletModalContext } from "@solana/wallet-adapter-react-ui";
import type { WalletModalProps } from "./WalletModal";
import { WalletModal } from "./WalletModal";

export interface WalletModalProviderProps extends WalletModalProps {
  children: ReactNode;
}

export const WalletModalProvider: FC<WalletModalProviderProps> = ({
  children,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <WalletModalContext.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
      {visible && <WalletModal {...props} />}
    </WalletModalContext.Provider>
  );
};
