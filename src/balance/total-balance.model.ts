import { Balance, Dictionary } from 'ccxt';
import { ExchangeBalance } from './exchange-balance.model';
import { WalletBalance } from './wallet-balance.model';

export class TotalBalance {
  exchanges: ExchangeBalance[] = [];
  wallets: WalletBalance[] = [];
  total: Dictionary<Balance> = {};
}
