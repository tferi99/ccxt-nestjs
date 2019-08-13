import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { CcxtController } from './ccxt/ccxt.controller';
import { CcxtService } from './ccxt/ccxt.service';

@Module({
  imports: [ConfigModule],
  controllers: [AppController, CcxtController],
  providers: [AppService, CcxtService],
})
export class AppModule {}
