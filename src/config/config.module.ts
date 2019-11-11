import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';

@Module({
  controllers: [ConfigController, ConnectionController],
  providers: [ConfigService, ConnectionService],
  exports: [ConfigService, ConnectionService],
})
export class ConfigModule {}
