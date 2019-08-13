import { Injectable } from '@nestjs/common';
import { ExchangeConfig } from '../model/exchange-config';
import * as ccxt from 'ccxt';

@Injectable()
export class CcxtService {
  inited = false;

  validate(config: ExchangeConfig): void {
    if (!this.inited) {
      this.init();
    }
  }

  getExchanges(): string[] {
    return ccxt.exchanges;
  }

  // ---------------------------- helpers ------------------------
  private init() {

  }
}
