import { Injectable } from '@nestjs/common';
import { Balance, Dictionary, Exchange } from 'ccxt';
import { ConnectionService } from '../config/connection.service';
import { TotalBalance } from './total-balance.model';
import { queryParamToBool } from '../core/utils/request-utils';
import { ExchangeBalance } from './exchange-balance.model';
import { ConfigService } from '../config/config.service';
import { ExchangeConfig } from '../config/config.model';

@Injectable()
export class BalanceService {
  constructor(
    private configService: ConfigService,
    private connectionService: ConnectionService
  ) {}

  async getExchangeBalance(exchange: Exchange, onlyNotNull: boolean = true): Promise<ExchangeBalance> {
    const ret = new ExchangeBalance();
    ret.exchange = exchange.id;

    let balance;
    try {
      balance = await exchange.fetchBalance();
    } catch (e) {
      ret.error = e;
      ret.errorMessage = e.message;
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

  async getExchangeBalanceById(exchangeId: string, onlyNotNull: boolean = true): Promise<ExchangeBalance> {
    const exchange = this.connectionService.getConnection(exchangeId);
    return this.getExchangeBalance(exchange, onlyNotNull);
  }

  async getTotalBalance(onlyNotNull: boolean = true, withInactive: boolean = false): Promise<TotalBalance> {
    const totalBalance = new TotalBalance();

    // exchanges
    const conns = this.connectionService.getConnections().values();
    // foreach() cannot work with async-await
    for (const exchange of conns) {
      const eb = await this.getExchangeBalance(exchange, onlyNotNull);
      totalBalance.exchanges.push(eb);

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

    if (withInactive) {
      const inactiveExchanges = this.configService.getInactiveExchangesConfig();
      inactiveExchanges.forEach(exch => totalBalance.exchanges.push(this.createExchangeBalanceWithError(exch, 'Exchange is inactive')));
    }

    return totalBalance;
  }

  // --------------------------------------------- helpers ---------------------------------------------
  private createExchangeBalanceWithError(exchange: ExchangeConfig, msg: string) {
    const eb = new ExchangeBalance();
    eb.exchange = exchange.id;
    eb.errorFound = true;
    eb.errorMessage = msg;
    eb.error = new Error(msg);
    return eb;
  }
}
