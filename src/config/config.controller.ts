import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService} from './config.service';
import { ConfigStatus, ExchangeConfig } from './config.model';

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

  @Get('exchange/:id')
  getExchange(@Param('id')id: string): ExchangeConfig {
    return this.getExchanges().find(ex => ex.id === id);
  }
}
