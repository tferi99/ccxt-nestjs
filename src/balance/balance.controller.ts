import { Controller, Get, Param, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance, Dictionary } from 'ccxt';
import { TotalBalance } from './total-balance.model';
import { queryParamToBool } from '../core/utils/request-utils';
import { ExchangeBalance } from './exchange-balance.model';

@Controller('balance')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get()
  async getTotalBalance(@Query('onlyNotNull')onlyNotNullParam: string, @Query('withInactive')withInactiveParam: string): Promise<TotalBalance> {
    const onlyNotNull = queryParamToBool(onlyNotNullParam, true);
    const withInactive = queryParamToBool(withInactiveParam, false);
    return this.balanceService.getTotalBalance(onlyNotNull, withInactive);
  }

  @Get('/:exchange')
  async getExchangeBalance(@Param('exchange')exchangeId: string, @Query('onlyNotNull')onlyNotNullParam?: string): Promise<ExchangeBalance> {
    const onlyNotNull = queryParamToBool(onlyNotNullParam, true);
    return this.balanceService.getExchangeBalanceById(exchangeId, onlyNotNull);
  }
}
