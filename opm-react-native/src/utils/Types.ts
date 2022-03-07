type AxiosError = {
  response: {
    data: {
      type: string;
    };
  };
};

type AxiosResponse = {
  data: {
    result: string;
    token?: string;
  };
};

export type { AxiosError, AxiosResponse };
