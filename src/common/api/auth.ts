export interface FacebookCredentials {
  access_token: string;
  expires_in: string;
  token_type: string;
}

export interface GoogleCredentials {
  accessToken: string;
  expiresIn: string;
  tokenType: string;
}

export interface PPIntegrationCredentialsAPIModel {
  data: {
    accessToken: string;
    expiresIn: string;
    tokenType: string;
  };
}

// api/auth/(facebook|google)
export interface PPLoginResponseAPIModel {
  data: {
    access: string;
    refresh: string;
    userId: string;
  };
}
