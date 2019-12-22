import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { queryParamToBool } from '../core/utils/request-utils';
import { Exchange } from 'ccxt';

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

  @Get('/object')
  getConnectionObjects(): Exchange[] {
    // read only (don't create)
    return Array.from(this.connectionService.getConnections(false).values());
  }

  @Get('/object/:exchange')
  getConnectionObject(@Param('exchange')exhangeId: string): Exchange {
    // read only (don't create)
    return this.connectionService.getConnection(exhangeId);
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
