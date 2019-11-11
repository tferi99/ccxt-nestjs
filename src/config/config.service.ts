import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as FileUtils from '../core/utils/file-utils';
import { AppConfig, ConfigStatus, ExchangeConfig } from './config.model';

export const CONFIG_FILE = '/tmp/config.json';

@Injectable()
export class ConfigService {
  private readonly log = new Logger(ConfigService.name);

  config: AppConfig;

  status: ConfigStatus = {
    inited: false,
  };

  constructor() {}

  init(): boolean {
    try {
      this.log.debug('Configuration loading from:' + CONFIG_FILE);
      this.config = FileUtils.loadJsonFile(CONFIG_FILE) as AppConfig;

      // inited
      this.status.inited = true;
      this.status.error = undefined;

      this.config.exchanges.forEach((exConfig: ExchangeConfig, index: number) => exConfig.validated = false);
    } catch (err) {
      Logger.error('Error during loading configuration from ' + CONFIG_FILE + err);
      this.status.inited = false;
      this.status.error = err.toString();
      return false;
    }
    return this.status.inited;
  }

  getStatus(): ConfigStatus {
    return this.status;
  }

  getExchanges(): ExchangeConfig[] {
    return this.config.exchanges;
  }

  getExchangeConfig(exchangeId: string): ExchangeConfig {
    this.checkInited();

    const cfg = this.config.exchanges.find(exc => exc.id === exchangeId);
    if (!cfg) {
      throw new Error(`Configuration not found for ${exchangeId}`);
    }
    if (!cfg.active) {
      throw new Error(`Configuration for ${exchangeId} is not active`);
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
