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
  accessToken: string;
  expiresIn: string;
  tokenType: string;
}

export const UserRoles = {
  reader: 'reader',
  editor: 'editor',
};

// api/auth/(facebook|google)
export interface PPLoginResponseAPIModel {
  access: string;
  refresh: string;
  userId: string;
  userEmail: string;
  userRole: string;
}
