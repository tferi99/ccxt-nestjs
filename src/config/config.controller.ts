import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ExchangeConfig } from '../model/exchange-config';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  get(): string {
    return 'OK';
  }

  @Get('exchanges')
  getExchanges(): ExchangeConfig[] {
    return this.configService.getExchanges();
  }
}
