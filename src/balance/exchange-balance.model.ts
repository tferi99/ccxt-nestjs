import { Balance, Dictionary } from 'ccxt';

export class ExchangeBalance {
  exchange: string;
  balance: Dictionary<Balance> = {};
  errorFound = false;
  error: Error;
  errorMessage: string;
}
