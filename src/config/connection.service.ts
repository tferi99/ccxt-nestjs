import { Injectable, Logger } from '@nestjs/common';
import { Exchange } from 'ccxt';
import { ConfigService } from './config.service';
import * as ccxt from 'ccxt';

const defaultConfig = {
  timeout: 30000,
  enableRateLimit: true,
  verbose: false,
};

@Injectable()
export class ConnectionService {
  private readonly log = new Logger(ConnectionService.name);
  connections: Map<string, Exchange> = new Map<string, Exchange>();

  constructor(private configService: ConfigService) {}

  getConnection(exchangeId: string): Exchange {
    let exchange = this.connections.get(exchangeId);
    if (!(this.connections.get(exchangeId))) {
      const cfg = this.configService.getExchangeConfig(exchangeId);
      const exchangeClass = ccxt[exchangeId];
      const config = {...defaultConfig, ...cfg};
      this.log.debug(`Creating connection to Exchange[${exchangeId}]`);
      console.log('Config: ', config);
      exchange = new exchangeClass(config);
      this.connections.set(exchangeId, exchange);
    }
    return exchange;
  }
}
