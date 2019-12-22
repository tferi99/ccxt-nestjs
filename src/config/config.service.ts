import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as FileUtils from '../core/utils/file-utils';
import { AppConfig, ConfigStatus, ExchangeConfig } from './config.model';
import * as _ from 'lodash';
import { Exchange } from "ccxt";
import { ConnectionService } from './connection.service';

export const CONFIG_FILE = '/tmp/config.json';

@Injectable()
export class ConfigService {
  private readonly log = new Logger(ConfigService.name);

  config: AppConfig;

  status: ConfigStatus = {
    inited: false,
  };

  constructor(
    @Inject(forwardRef(() => ConnectionService))
    private connectionService: ConnectionService,
  ) {}

  init(): boolean {
    this.connectionService.disconnectAll();

    try {
      this.log.debug('Configuration loading from:' + CONFIG_FILE);
      this.config = FileUtils.loadJsonFile(CONFIG_FILE) as AppConfig;

      // inited
      this.config.exchanges.forEach((exConfig: ExchangeConfig, index: number) => exConfig.validated = false);
      this.status.inited = true;
      this.status.error = undefined;
      this.log.log('Configuration loaded from ' + CONFIG_FILE);
    } catch (err) {
      this.log.error('Error during loading configuration from ' + CONFIG_FILE + err);
      this.status.inited = false;
      this.status.error = err.toString();
      return false;
    }
    return this.status.inited;
  }

  getStatus(): ConfigStatus {
    return this.status;
  }

  /**
   * It returns a COPY of exchange configs
   */
  getExchangesConfig(hideSecrets: boolean = true, onlyEnabled: boolean = true): ExchangeConfig[] {
    let exchanges: ExchangeConfig[] = _.cloneDeep(this.config.exchanges);
    if (hideSecrets) {
      exchanges.forEach(exch => {
        exch.secret = '*****';
        exch.password = '*****';
      });
    }
    if (onlyEnabled) {
      exchanges = exchanges.filter(exch => exch.enabled);
    }
    return exchanges;
  }

  getInactiveExchangesConfig(): ExchangeConfig[] {
    return this.config.exchanges.filter(exch => !exch.active);
  }

  getExchangeConfig(exchangeId: string): ExchangeConfig {
    this.checkInited();

    const cfg = this.config.exchanges.find(exc => exc.id === exchangeId);
    if (!cfg) {
      throw new NotFoundException(`Configuration not found for ${exchangeId}`);
    }
    if (!cfg.enabled) {
      throw new NotAcceptableException(`Configuration for ${exchangeId} is not active`);
    }
    return cfg;
  }

  // ---------------------- helpers ----------------------
  private checkInited() {
    if (!this.status.inited) {
      throw new Error('Configuration not initialized');
    }
  }
}
