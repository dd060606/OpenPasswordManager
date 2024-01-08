import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Credentials } from "app/types/types";
//Dynamic config
let token = "";
let password = "";
let offlineMode = false;

let settings = {
  theme: "light",
  biometric: true,
  sortValue: 2,
};
let offlineDB = [] as Credentials[];
export function isTokenValid(): boolean {
  return token.length === 0 ? false : true;
}

export function getToken() {
  return token;
}

export function isOfflineMode() {
  return offlineMode;
}
export function setOfflineMode(enabled: boolean) {
  offlineMode = enabled;
}

export function setToken(newToken: string): void {
  token = newToken;
}

export function getPassword(): string {
  return password;
}

export function setPassword(newPassword: string): void {
  password = newPassword;
}

export async function saveSecure(key: string, data: string) {
  return await SecureStore.setItemAsync(key, data);
}
export async function getSecure(key: string) {
  const res = await SecureStore.getItemAsync(key);
  return res ? res : null;
}
export async function getProtected(key: string, messages: string[]) {
  const biometricAuth = await LocalAuthentication.authenticateAsync({
    promptMessage: messages[0],
    disableDeviceFallback: true,
    cancelLabel: messages[1],
  });
  if (biometricAuth.success) {
    const res = await SecureStore.getItemAsync(key);
    return res ? res : null;
  } else {
    return null;
  }
}

//Settings
export function getSettings() {
  return settings;
}

export async function loadSettings() {
  const storedSettings = await getSecure("settings");
  if (storedSettings) {
    settings = JSON.parse(storedSettings);
  }
  /*
  let num = 0;
  let db = "";
  while ((await SecureStore.getItemAsync("db-" + num)) !== null) {
    db += await SecureStore.getItemAsync("db-" + num);
    num++;
  }
  */
  const db = await getSecure("db");
  if (db) {
    offlineDB = JSON.parse(db);
  }
}
function saveSettings() {
  saveSecure("settings", JSON.stringify(settings));
}
export function setTheme(theme: string) {
  settings.theme = theme;
  saveSettings();
}
export function getTheme() {
  return settings.theme;
}
export function setBiometricAuth(enabled: boolean) {
  settings.biometric = enabled;
  saveSettings();
}
export function isBiometricAuth() {
  return settings.biometric;
}
export function getSortValue() {
  return settings.sortValue;
}
export function setSortValue(value: number) {
  settings.sortValue = value;
  saveSettings();
}

export function getOfflineDB() {
  return offlineDB;
}
export async function setOfflineDB(db: Credentials[]) {
  offlineDB = db;
  /*
  let num = 0;
  while ((await SecureStore.getItemAsync("db-" + num)) !== null) {
    await SecureStore.deleteItemAsync("db-" + num);
    num++;
  }
  num = 0;
  chunkString(JSON.stringify(db), 2000).forEach((chunk) => {
    saveSecure("db-" + num, chunk);
    num++;
  });
  */
  saveSecure("db", JSON.stringify(offlineDB));
}
