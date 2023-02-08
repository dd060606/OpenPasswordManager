//Dynamic config
let token = "";
let password = "";

function isTokenValid(): boolean {
  return token.length === 0 ? false : true;
}

function getToken(): string {
  return token;
}

function setToken(newToken: string): void {
  token = newToken;
}

function getPassword(): string {
  return password;
}

function setPassword(newPassword: string): void {
  password = newPassword;
}

export { isTokenValid, getToken, setToken, setPassword, getPassword };
