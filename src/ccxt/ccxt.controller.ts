import { Controller, Get } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CcxtService } from './ccxt.service';

@Controller('ccxt')
export class CcxtController {
  constructor(private ccxtService: CcxtService) {}

  @Get('exchanges')
  getExchanges(): string[] {
    return this.ccxtService.getExchanges();
  }
}
