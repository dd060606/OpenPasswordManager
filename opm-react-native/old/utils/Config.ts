//Dynamic config
let token: string = "";

function isTokenValid(): boolean {
  return token.length === 0 ? false : true;
}

function getToken(): string {
  return token;
}

function setToken(newToken: string): void {
  token = newToken;
}

export { isTokenValid, getToken, setToken };
