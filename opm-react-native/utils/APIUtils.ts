import { API_URL } from "app/config.json";
import {
  getPassword,
  getToken,
  saveSecure,
  setOfflineDB,
  setPassword,
  setToken,
} from "./Config";
import axios, { AxiosError } from "axios";
import {
  AxiosAuthResponse,
  AxiosCredentialsResponse,
  Credentials,
} from "app/types/types";
import { extractRootDomain } from "./Utils";
import CryptoES from "crypto-es";

export function getCredentials() {
  return new Promise<Credentials[]>((resolve, reject) => {
    axios
      .get(`${API_URL}/api/credentials/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((result: AxiosCredentialsResponse) => {
        for (let i = 0; i < result.data.credentials.length; i++) {
          result.data.credentials[
            i
          ].sImageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${extractRootDomain(
            result.data.credentials[i].url
          ).replace(".", "_")}@2x.png`;
          result.data.credentials[
            i
          ].lImageURL = `https://d2erpoudwvue5y.cloudfront.net/_160x106/${extractRootDomain(
            result.data.credentials[i].url
          ).replace(".", "_")}@2x.png`;
        }
        setOfflineDB(result.data.credentials);
        resolve(result.data.credentials);
      })
      .catch((err) => reject(err));
  });
}

export function addCredentials(
  username: string,
  password: string,
  websiteName: string,
  url: string
) {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(
        `${API_URL}/api/credentials/add/`,
        {
          username: username,
          password: CryptoES.AES.encrypt(password, getPassword()).toString(),
          name: websiteName,
          url: url
            ? url.startsWith("http://") || url.startsWith("https://")
              ? url
              : `https://${url}`
            : "",
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

export function editCredentials(
  id: number,
  username: string,
  password: string,
  websiteName: string,
  url: string
) {
  return new Promise<void>((resolve, reject) => {
    axios
      .put(
        `${API_URL}/api/credentials/edit/${id}`,
        {
          username: username,
          password: CryptoES.AES.encrypt(password, getPassword()).toString(),
          name: websiteName,
          url: url
            ? url.startsWith("http://") || url.startsWith("https://")
              ? url
              : `https://${url}`
            : "",
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

export function deleteCredentials(id: number) {
  return new Promise<void>((resolve, reject) => {
    axios
      .delete(`${API_URL}/api/credentials/delete/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}
export function resendEmail(email: string, lang: string) {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/email/resend`, {
        email: email,
        lang: lang,
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

export function login(email: string, password: string) {
  return new Promise<AxiosAuthResponse>((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/login`, {
        email: email,
        password: password,
      })
      .then((res: AxiosAuthResponse) => {
        if (res.data && res.data.token) {
          setToken(res.data.token);
          setPassword(password);
          saveSecure("email", email);
          saveSecure("password", password);
        }
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
export function register(
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  lang: string
) {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/signup`, {
        lastname: lastname,
        firstname: firstname,
        email: email,
        password: password,
        lang: lang,
      })
      .then((res: AxiosAuthResponse) => {
        if (res.data && res.data.token) {
          setToken(res.data.token);
          setPassword(password);
          saveSecure("email", email);
          saveSecure("password", password);
        }
        resolve();
      })
      .catch((err) => reject(err));
  });
}
export function isEmailValidated(email: string) {
  return new Promise<AxiosAuthResponse>((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/email/validated`, { email: email })
      .then((res: AxiosAuthResponse) => resolve(res))
      .catch((err) => reject(err));
  });
}
