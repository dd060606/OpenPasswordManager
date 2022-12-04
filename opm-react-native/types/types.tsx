/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
export type RootStackParamList = {
  Modal: undefined;
  NotFound: undefined;
  Login: RootStackScreenProps<"Login">;
  Register: RootStackScreenProps<"Register">;
  Passwords: RootStackScreenProps<"Passwords">;
  Settings: RootStackScreenProps<"Settings">;
  Account: RootStackScreenProps<"Account">;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type Credentials = {
  id: number;
  name: string;
  password: string;
  url: string;
  user_id: number;
  username: string;
  sImageURL: string;
  lImageURL: string;
};

export type AxiosError = {
  response: {
    data: {
      type: string;
      result: string;
    };
  };
  message: string;
};

export type AxiosResponse = {
  data: {
    result: string;
  };
};

export type AxiosAuthResponse = AxiosResponse & {
  data: {
    token?: string;
    value?: boolean;
  };
};

export type AxiosCredentialsResponse = {
  data: {
    credentials: Credentials[];
  };
};
