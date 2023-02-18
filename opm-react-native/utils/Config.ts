import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
//Dynamic config
let token = "";
let password = "";

let settings = { theme: "", biometric: true };

export function isTokenValid(): boolean {
  return token.length === 0 ? false : true;
}

export function getToken(): string {
  return token;
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
