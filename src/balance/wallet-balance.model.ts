import { Balance, Dictionary } from 'ccxt';

export const enum WalletType {
  BTC, ERC20,
}

export class WalletBalance {
  name: string;
  address: string;
  type: WalletType;
}
