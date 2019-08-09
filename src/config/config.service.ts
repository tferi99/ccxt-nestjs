import { Injectable } from '@nestjs/common';
import { ExchangeConfig } from '../model/exchange-config';
import * as fs from 'fs';
import { Configuration } from '../model/configuration';
import { Logger } from '@nestjs/common';

export const CONFIG_FILE = '/tmp/config.json';

@Injectable()
export class ConfigService {
  config: Configuration;

  constructor() {}

  getExchanges(): ExchangeConfig[] {
    Logger.debug('Configuration loading from:' + CONFIG_FILE);
    if (!this.config) {
      try {
        const fileContents = fs.readFileSync(CONFIG_FILE, 'utf8');
        if (fileContents) {
          this.config = JSON.parse(fileContents);
        }
      } catch (err) {
        Logger.error('ERROR !!!!!!!!!!!!!:' + err);
      }
      return this.config.exchanges;
    }
  }
}
