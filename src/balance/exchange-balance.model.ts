import { Balance, Dictionary } from 'ccxt';

export class ExchangeBalance {
  exchange: string;
  balance: Dictionary<Balance> = {};
  error: Error;
}
