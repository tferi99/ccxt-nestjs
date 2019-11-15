import { Controller, Get } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CcxtService } from './ccxt.service';

@Controller('ccxt')
export class CcxtController {
  constructor(private ccxtService: CcxtService) {}

  @Get('exchanges')
  getSupportedExchanges(): string[] {
    return this.ccxtService.getSupportedExchanges();
  }
}
