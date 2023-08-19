function extractHostname(url: string) {
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

function extractRootDomain(url: string) {
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

export { extractHostname, extractRootDomain };
