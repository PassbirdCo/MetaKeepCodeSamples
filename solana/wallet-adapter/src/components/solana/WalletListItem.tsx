// Adapted from official solana wallet adapter react UI package: https://github.com/anza-xyz/wallet-adapter/blob/master/packages/ui/react-ui/src/WalletListItem.tsx

import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { Wallet } from "@solana/wallet-adapter-react";
import type { FC, MouseEventHandler } from "react";
import React from "react";
import { Button } from "./Button";
import { WalletIcon } from "@solana/wallet-adapter-react-ui";

export interface WalletListItemProps {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  wallet: Wallet;
  isDefault: boolean;
}

export const WalletListItem: FC<WalletListItemProps> = ({
  handleClick,
  tabIndex,
  wallet,
  isDefault,
}) => {
  return (
    <li className="wallet-list-item">
      <Button
        onClick={handleClick}
        startIcon={<WalletIcon wallet={wallet} />}
        tabIndex={tabIndex}
      >
        {wallet.adapter.name}
        {isDefault && (
          <div className="background-tile">
            <span className="detected">Recommended</span>
          </div>
        )}
        {wallet.readyState === WalletReadyState.Installed && (
          <div className="background-tile">
            <span className="detected">Detected</span>
          </div>
        )}
      </Button>
    </li>
  );
};
