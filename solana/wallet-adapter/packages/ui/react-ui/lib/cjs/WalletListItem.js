"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletListItem = void 0;
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const react_1 = __importDefault(require("react"));
const Button_js_1 = require("./Button.js");
const WalletIcon_js_1 = require("./WalletIcon.js");
const isMetaKeepWallet = (wallet) => wallet.adapter.name === 'MetaKeep';
const WalletListItem = ({ handleClick, tabIndex, wallet, isDefault }) => {
    return (react_1.default.createElement("li", { className: 'wallet-list-item' },
        react_1.default.createElement(Button_js_1.Button, { onClick: handleClick, startIcon: react_1.default.createElement(WalletIcon_js_1.WalletIcon, { wallet: wallet }), tabIndex: tabIndex },
            isMetaKeepWallet(wallet) ? "Use Email (or Phone)" : wallet.adapter.name,
            wallet.readyState === wallet_adapter_base_1.WalletReadyState.Installed && react_1.default.createElement("div", { className: 'background-tile' },
                react_1.default.createElement("span", { className: 'detected' }, "Detected")),
            isDefault && react_1.default.createElement("div", { className: 'background-tile' },
                react_1.default.createElement("span", { className: 'detected' }, "Recommended")))));
};
exports.WalletListItem = WalletListItem;
//# sourceMappingURL=WalletListItem.js.map