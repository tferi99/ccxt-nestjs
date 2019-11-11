import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { CcxtController } from './ccxt/ccxt.controller';
import { CcxtService } from './ccxt/ccxt.service';
import { BalanceModule } from './balance/balance.module';

@Module({
  imports: [ConfigModule, BalanceModule],
  controllers: [AppController, CcxtController],
  providers: [AppService, CcxtService],
})
export class AppModule {}
