import { Injectable } from '@nestjs/common';
import { Balance, Dictionary } from 'ccxt';
import { ConnectionService } from '../config/connection.service';

@Injectable()
export class BalanceService {
  constructor(private connectionService: ConnectionService) {}

  async getBalance(exchangeId: string, onlyNotNull: boolean = true): Promise<Dictionary<Balance>> {
    const exchange = this.connectionService.getConnection(exchangeId);
    const balance = await exchange.fetchBalance();
    const ret = {};

    // tslint:disable-next-line:no-string-literal
    const total = balance['total'];
    if (onlyNotNull) {
        for (const curr in total) {
            if (!onlyNotNull || total[curr] > 0) {
              ret[curr] = balance[curr];
            }
        }
    }
    return ret;
  }
}
