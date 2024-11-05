import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import type { FC, MouseEventHandler } from 'react';
import React from 'react';
import { Button } from './Button.js';
import { WalletIcon } from './WalletIcon.js';

export interface WalletListItemProps {
    handleClick: MouseEventHandler<HTMLButtonElement>;
    tabIndex?: number;
    wallet: Wallet;
    isDefault: boolean;
}

const isMetaKeepWallet = (wallet: Wallet) => wallet.adapter.name === 'MetaKeep';

export const WalletListItem: FC<WalletListItemProps> = ({ handleClick, tabIndex, wallet, isDefault }) => {
    return (
        <li className='wallet-list-item'>
            <Button onClick={handleClick} startIcon={<WalletIcon wallet={wallet} />} tabIndex={tabIndex}>
                {isMetaKeepWallet(wallet) ? "Use Email (or Phone)": wallet.adapter.name}
                {wallet.readyState === WalletReadyState.Installed && <div className='background-tile'><span className='detected'>Detected</span></div>}
                {isDefault && <div className='background-tile'><span className='detected'>Recommended</span></div>}
            </Button>
        </li>
    );
};
