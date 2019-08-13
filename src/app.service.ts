import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService) {
    configService.init();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
