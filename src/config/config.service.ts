import { Injectable } from '@nestjs/common';
import { ExchangeConfig } from '../model/exchange-config';
import * as fs from 'fs';
import { Configuration } from '../model/configuration';
import { AppLogger } from '../core/AppLogger';

export const CONFIG_FILE = './config.json';

@Injectable()
export class ConfigService {
  config: Configuration;

  constructor(private log: AppLogger) {}

  getExchanges(): ExchangeConfig[] {
    if (!this.config) {
      const fileContents = fs.readFileSync(CONFIG_FILE, 'utf8');
      try {
        const data = JSON.parse(fileContents);
      } catch(err) {
        this.log.error(err);
      }
      return this.config.exchanges;
    }
  }
}
