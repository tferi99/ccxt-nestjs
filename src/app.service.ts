import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class AppService {
  getHello(): string {
    const exchanges: string[] = ccxt.exchanges;

    let e = '';
    exchanges.forEach(ex => {
      e += ex + ', ';
    })
    return 'Hello World! ' + e;
  }
}
