import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ConfigService} from './config.service';
import { ConfigStatus, ExchangeConfig } from './config.model';
import { queryParamToBool } from '../core/utils/request-utils';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  get(): ConfigStatus {
    return this.configService.getStatus();
  }

  @Get('reload')
  refresh(): ConfigStatus {
    this.configService.init();
    return this.configService.getStatus();
  }

  @Get('exchanges')
  getExchanges(@Query('onlyEnabled')onlyEnabledParam?: string): ExchangeConfig[] {
    const onlyEnabled = queryParamToBool(onlyEnabledParam, true);         // default: true
    return this.configService.getExchangesConfig(true, onlyEnabled);
  }

  @Get('exchange/:id')
  getExchange(@Param('id')id: string): ExchangeConfig {
    const cfg = this.getExchanges().find(ex => ex.id === id);
    if (!cfg) {
      throw new NotFoundException(`${id} : Exchange not found`);
    }
    return this.getExchanges().find(ex => ex.id === id);
  }
}
