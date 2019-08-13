import { Controller, Get } from '@nestjs/common';
import { ConfigService, ConfigStatus } from './config.service';
import { ExchangeConfig } from '../model/exchange-config';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  get(): ConfigStatus {
    return this.configService.getStatus();
  }

  @Get('refresh')
  refresh(): ConfigStatus {
    this.configService.init();
    return this.configService.getStatus();
  }

  @Get('exchanges')
  getExchanges(): ExchangeConfig[] {
    return this.configService.getExchanges();
  }
}
