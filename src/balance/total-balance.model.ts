import { Balance, Dictionary } from 'ccxt';
import { ExchangeBalance } from './exchange-balance.model';

export class TotalBalance {
  exchangeBalances: ExchangeBalance[] = [];
  total: Dictionary<Balance> = {};
}
