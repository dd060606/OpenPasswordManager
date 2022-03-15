type Credentials =
  | {
      id: number;
      name: string;
      password: string;
      url: string;
      user_id: number;
      username: string;
    }[]
  | {}[];

type AxiosError = {
  response: {
    data: {
      type: string;
      result: string;
    };
  };
};

type AxiosResponse = {
  data: {
    result: string;
  };
};

type AxiosAuthResponse = AxiosResponse & {
  data: {
    token?: string;
    value?: boolean;
  };
};

type AxiosCredentialsResponse = {
  data: {
    credentials: Credentials;
  };
};

export type {
  AxiosError,
  AxiosResponse,
  AxiosAuthResponse,
  AxiosCredentialsResponse,
  Credentials,
};
