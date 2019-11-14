import { Injectable } from '@nestjs/common';
import { Balance, Dictionary, Exchange } from 'ccxt';
import { ConnectionService } from '../config/connection.service';
import { TotalBalance } from './total-balance.model';
import { queryParamToBool } from '../core/utils/request-utils';
import { ExchangeBalance } from './exchange-balance.model';

@Injectable()
export class BalanceService {
  constructor(private connectionService: ConnectionService) {}

  async getBalance(exchange: Exchange, onlyNotNull: boolean = true): Promise<ExchangeBalance> {
    const ret = new ExchangeBalance();
    ret.exchange = exchange.name;

    let balance;
    try {
      balance = await exchange.fetchBalance();
    } catch (e) {
      ret.error = e;
      return ret;
    }
    // tslint:disable-next-line:no-string-literal
    const total = balance['total'];
    for (const curr in total) {
      if (!onlyNotNull || total[curr] > 0) {
        ret.balance[curr] = balance[curr];
      }
    }
    return ret;
  }

  async getExchangeBalance(exchangeId: string, onlyNotNull: boolean = true): Promise<ExchangeBalance> {
    const exchange = this.connectionService.getConnection(exchangeId);
    return this.getBalance(exchange, onlyNotNull);
  }

  async getTotalBalance(onlyNotNull: boolean = true): Promise<TotalBalance> {
    const totalBalance = new TotalBalance();
    const conns = this.connectionService.getConnections().values();
    for (const exchange of conns) {
      const eb = await this.getBalance(exchange, onlyNotNull);
      totalBalance.exchangeBalances.push(eb);

      if (!eb.error) {
        // console.log('EEEEBBB ' + eb.exchange);
        const keys = Object.keys(eb.balance);
        for (const curr of keys) {
          const totalCurr = totalBalance.total[curr];
          const bal = eb.balance[curr];
          if (!totalCurr) {
            totalBalance.total[curr] = {
              free: bal.free,
              total: bal.total,
              used: bal.used,
            };
          } else {
            totalCurr.free += bal.free;
            totalCurr.used += bal.used;
            totalCurr.total += bal.total;
          }
        }
      }
    }
    return totalBalance;
  }
}
