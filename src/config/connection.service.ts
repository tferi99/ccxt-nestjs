import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Exchange } from 'ccxt';
import { ConfigService } from './config.service';
import * as ccxt from 'ccxt';
import { ExchangeConfig } from './config.model';

const defaultConfig = {
  timeout: 30000,
  enableRateLimit: true,
  verbose: true,
};

@Injectable()
export class ConnectionService {
  private readonly log = new Logger(ConnectionService.name);
  private connections: Map<string, Exchange> = new Map<string, Exchange>();
  private connectionsInited = false;

  constructor(
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
  ) {}

  getConnection(exchangeId: string): Exchange {
    let exchange = this.connections.get(exchangeId);
    if (!exchange) {
      exchange = this.createConnection(exchangeId);
      // add only if created successfully
      if (exchange) {
        this.connections.set(exchangeId, exchange);
      }
    }
    return exchange;
  }

  getConnections(create: boolean = true): Map<string, Exchange> {
    if (create) {
      if (!this.connectionsInited) {
        this.initConnections();
      }
    }
    return this.connections;
  }



  disconnect(exchangeId: string): void {
    this.connections.delete(exchangeId);
  }

  disconnectAll(): void {
    this.connections = new Map<string, Exchange>();
  }

  initConnections(): number {
    this.disconnectAll();
    this.configService.getExchangesConfig().forEach((exchCfg: ExchangeConfig) => {
      const exchangeId = exchCfg.id;
      let exchange = this.connections.get(exchangeId);
      if (!exchange) {
        exchange = this.createConnection(exchangeId);
        // add only if created successfully
        if (exchange) {
          this.connections.set(exchCfg.id, exchange);
        }
      }
    });
    return this.connections.size;
  }

  private createConnection(exchangeId: string): Exchange {
    const cfg = this.configService.getExchangeConfig(exchangeId);
    const exchangeClass = ccxt[exchangeId];
    if (!exchangeClass) {
      const msg = `Exchange cannot be created for: [${exchangeId}]`;
      this.log.error(msg);
      cfg.active = false;
      cfg.error = new Error(msg);
      cfg.errorMessage = msg;
      return null;
    } else {
      const config = {...defaultConfig, ...cfg};
      const configInfo = {id: config.id, apiKey: config.apiKey, verbose: config.verbose, enableRateLimit: config.enableRateLimit, timeout: config.timeout};
      // console.log('Config: ', config);
      this.log.debug(`Creating connection to Exchange[${exchangeId}]`, JSON.stringify(configInfo));
      try {
        const exchange = new exchangeClass(config);
        cfg.active = true;
        return exchange;
      } catch (e) {
        cfg.active = false;
        cfg.error = e;
        cfg.errorMessage = e.message;
        return null;
      }
    }
  }
}
