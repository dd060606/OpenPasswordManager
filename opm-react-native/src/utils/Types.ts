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
    token?: string;
    value?: boolean;
  };
};

export type { AxiosError, AxiosResponse };
