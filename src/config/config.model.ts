export interface ConfigStatus {
  inited: boolean;
  error?: string;
}

export interface ExchangeConfig {
  id: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  validated: boolean;
  active: boolean;
  verbose?: boolean;
  enableRateLimit?: boolean;
  timeout?: number;
}

export interface AppConfig {
  exchanges: ExchangeConfig[];
}
