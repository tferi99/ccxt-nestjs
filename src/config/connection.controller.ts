import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { queryParamToBool } from '../core/utils/request-utils';

@Controller('connection')
export class ConnectionController {
  constructor(
    private connectionService: ConnectionService,
  ) {}

  /**
   * Only get existing connections - don't create missing ones.
   */
  @Get()
  getConnections(): string[] {
    // read only (don't create)
    return Array.from(this.connectionService.getConnections(false).keys());
  }

  @Post('disconnect')
  disconnectAll() {
    this.connectionService.disconnectAll();
  }

  @Post('disconnect/:exchange')
  disconnect(@Param('exchange')exhangeId: string) {
    this.connectionService.disconnect(exhangeId);
  }

  @Post()
  connectAll(): number {
    return this.connectionService.initConnections();
  }
}
