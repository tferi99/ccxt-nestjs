import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ExchangeConfig } from '../model/exchange-config';
import * as fs from 'fs';
import { Configuration } from '../model/configuration';

export const CONFIG_FILE = '/tmp/config.json';

export interface ConfigStatus {
  inited: boolean;
  error?: string;
}

@Injectable()
export class ConfigService {
  config: Configuration;
  status: ConfigStatus = {
    inited: false,
  };

  constructor() {}

  init(): boolean {
    let fileContents;

    // load
    try {
      Logger.debug('Configuration loading from:' + CONFIG_FILE);
      fileContents = fs.readFileSync(CONFIG_FILE, 'utf8');

      // parse
      try {
        this.config = JSON.parse(fileContents);
      } catch (err) {
        Logger.error('Error during parsing configuration from ' + CONFIG_FILE + err);
        this.status.inited = false;
        this.status.error = err.toString();
      }

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
}
