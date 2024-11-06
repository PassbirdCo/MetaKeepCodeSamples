import { WalletReadyState } from '@solana/wallet-adapter-base';
import React from 'react';
import { Button } from './Button.js';
import { WalletIcon } from './WalletIcon.js';
const isMetaKeepWallet = (wallet) => wallet.adapter.name === 'MetaKeep';
export const WalletListItem = ({ handleClick, tabIndex, wallet, isDefault }) => {
    return (React.createElement("li", { className: 'wallet-list-item' },
        React.createElement(Button, { onClick: handleClick, startIcon: React.createElement(WalletIcon, { wallet: wallet }), tabIndex: tabIndex },
            isMetaKeepWallet(wallet) ? "Use Email (or Phone)" : wallet.adapter.name,
            wallet.readyState === WalletReadyState.Installed && React.createElement("div", { className: 'background-tile' },
                React.createElement("span", { className: 'detected' }, "Detected")),
            isDefault && React.createElement("div", { className: 'background-tile' },
                React.createElement("span", { className: 'detected' }, "Recommended")))));
};
//# sourceMappingURL=WalletListItem.js.map