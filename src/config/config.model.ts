export interface ConfigStatus {
  inited: boolean;
  error?: string;
}

export interface ExchangeConfig {
  id: string;
  name: string;
  apiKey: string;
  secret: string;
  password: string;
  validated: boolean;
  enabled: boolean;
  verbose?: boolean;            // default specified
  enableRateLimit?: boolean;    // default specified
  timeout?: number;             // default specified

  // calculated during connection
  active: boolean;
  error: Error;
  errorMessage: string;
}

export interface AppConfig {
  exchanges: ExchangeConfig[];
}
