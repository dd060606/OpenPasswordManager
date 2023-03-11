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
