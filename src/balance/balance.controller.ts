import { Controller, Get, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance, Dictionary } from 'ccxt';

@Controller('balance')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get()
  //async getBalance(@Query('exchangeId')exchangeId: string, @Query('onlyNotNull')onlyNotNull: boolean = true): Promise<Map<string, Balance>> {
  async getBalance(@Query('exchangeId')exchangeId: string, @Query('onlyNotNull')onlyNotNull: boolean = true): Promise<Dictionary<Balance>> {
    const ret = this.balanceService.getBalance(exchangeId, onlyNotNull);
    return ret;
  }
}
