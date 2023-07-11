export interface requestError {
  status?: number;
  message?: string;
  statusCode?: number;
  validationError?: boolean;
}

export interface Error {
  message?: string;
  statusCode?: number;
  validationError?: boolean;
}


