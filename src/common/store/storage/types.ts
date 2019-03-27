
export interface IUserAuth {
  access: string;
  refresh: string;
  userRole: string;
}

export interface IUserProperties {
  userId: string;
  userEmail: string;
}

export type IUserState = IUserAuth & IUserProperties;

export interface IStorageState {
  auth: IUserState;
}
