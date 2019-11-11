import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { ExchangeConfig } from '../config/config.model';

@Injectable()
export class CcxtService {
  inited = false;

  validate(config: ExchangeConfig): void {
    if (!this.inited) {
      this.init();
    }
  }

  getSupportedExchanges(): string[] {
    return ccxt.exchanges;
  }

  // ---------------------------- helpers ------------------------
  private init() {

  }
}
