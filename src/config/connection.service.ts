import { Injectable, Logger } from '@nestjs/common';
import { Exchange } from 'ccxt';
import { ConfigService } from './config.service';
import * as ccxt from 'ccxt';
import { ExchangeConfig } from './config.model';

const defaultConfig = {
  timeout: 30000,
  enableRateLimit: true,
  verbose: false,
};

@Injectable()
export class ConnectionService {
  private readonly log = new Logger(ConnectionService.name);
  private connections: Map<string, Exchange> = new Map<string, Exchange>();
  private connectionsInited = false;

  constructor(private configService: ConfigService) {}

  getConnection(exchangeId: string): Exchange {
    let exchange = this.connections.get(exchangeId);
    if (!exchange) {
      exchange = this.createConnection(exchangeId);
      this.connections.set(exchangeId, exchange);
    }
    return exchange;
  }

  getConnections(): Map<string, Exchange> {
    if (!this.connectionsInited) {
      this.initConnections();
    }
    return this.connections;
  }

  private initConnections(): void {
    this.configService.getExchanges().forEach((exchCfg: ExchangeConfig) => {
      if (exchCfg.active) {
        const exchangeId = exchCfg.id;
        let exchange = this.connections.get(exchangeId);
        if (!exchange) {
          exchange = this.createConnection(exchangeId);
          this.connections.set(exchCfg.id, exchange);
        }
      }
    });
  }

  private createConnection(exchangeId: string): Exchange {
    const cfg = this.configService.getExchangeConfig(exchangeId);
    const exchangeClass = ccxt[exchangeId];
    const config = {...defaultConfig, ...cfg};
    this.log.debug(`Creating connection to Exchange[${exchangeId}]`);
    // console.log('Config: ', config);
    return new exchangeClass(config);
  }
}
