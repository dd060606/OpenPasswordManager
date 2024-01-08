import { Credentials } from "app/types/types";
import CryptoES from "crypto-es";
import { getPassword } from "./Config";

export function extractHostname(url: string) {
  let hostname: string = "";
  if (url.indexOf("//") > -1) {
    hostname =
      url.split("/")[2] !== undefined ? (url.split("/")[2] as string) : "";
  } else {
    hostname =
      url.split("/")[0] !== undefined ? (url.split("/")[0] as string) : "";
  }

  hostname =
    hostname.split(":")[0] !== undefined
      ? (hostname.split(":")[0] as string)
      : "";
  hostname =
    hostname.split("?")[0] !== undefined
      ? (hostname.split("?")[0] as string)
      : "";

  return hostname;
}

export function extractRootDomain(url: string) {
  let domain = extractHostname(url),
    splitArray = domain.split("."),
    arrLength = splitArray.length;
  if (arrLength > 2) {
    domain = splitArray[arrLength - 2] + "." + splitArray[arrLength - 1];
    if (
      splitArray[arrLength - 2]?.length === 2 &&
      splitArray[arrLength - 1]?.length === 2
    ) {
      domain = splitArray[arrLength - 3] + "." + domain;
    }
  }
  return domain;
}
export function sortCredentials(credentialsArray: any[], sortValue: number) {
  if (sortValue === 0) {
    return credentialsArray.sort((a, b) =>
      (a.name || "").toString().localeCompare((b.name || "").toString())
    );
  } else if (sortValue === 1) {
    return credentialsArray
      .sort((a, b) =>
        (a.name || "").toString().localeCompare((b.name || "").toString())
      )
      .sort()
      .reverse();
  } else {
    return credentialsArray.sort((a, b) => b.id - a.id);
  }
}
export function getTimeInSecond() {
  return Math.floor(Date.now() / 1000);
}
export function decryptString(password: string, key: string) {
  return CryptoES.AES.decrypt(password, key).toString(CryptoES.enc.Utf8);
}

type WeakPasswordsList = [{ credentials: Credentials; strength: 15 | 30 | 50 }];
export function getWeakPasswords(
  credentials: Credentials[]
): WeakPasswordsList {
  const weakCreds: Array<Object> = [];
  credentials.forEach((creds) => {
    const password = decryptString(creds.password, getPassword());
    const strength = calculatePasswordStrength(password);
    if (strength < 100) {
      weakCreds.push({ credentials: creds, strength: strength });
    }
  });
  weakCreds.sort((a: any, b: any) => {
    return a.strength - b.strength;
  });
  return weakCreds as WeakPasswordsList;
}

function calculatePasswordStrength(password: string): 15 | 50 | 30 | 100 | 70 {
  const containUpper = /^(?=.*[A-Z])[a-zA-Z\d!@#$%^&*()?_+-=.]{8,}$/;
  const containLower = /^(?=.*[a-z])[a-zA-Z\d!@#$%^&*()?_+-=.]{8,}$/;
  const containNumber = /^(?=.*\d)[a-zA-Z\d!@#$%^&*()?_+-=.]{8,}$/;
  const containSpecialChar =
    /^(?=.*[!@#$%^&*()?_+-=.])[a-zA-Z\d!@#$%^&*()?_+-=.]{8,}$/;

  if (password.length < 8) {
    return 15;
  } else if (password.length <= 12) {
    if (
      containUpper.test(password) &&
      containLower.test(password) &&
      !containNumber.test(password)
    ) {
      return 50;
    } else if (
      containUpper.test(password) &&
      containLower.test(password) &&
      containNumber.test(password) &&
      containSpecialChar.test(password)
    ) {
      return 70;
    } else {
      return 30;
    }
  } else if (password.length < 14) {
    if (
      containUpper.test(password) &&
      containLower.test(password) &&
      containNumber.test(password) &&
      containSpecialChar.test(password)
    ) {
      return 100;
    } else {
      return 50;
    }
  } else {
    if (
      containUpper.test(password) &&
      containLower.test(password) &&
      containNumber.test(password) &&
      containSpecialChar.test(password)
    ) {
      return 100;
    } else {
      return 70;
    }
  }
}
