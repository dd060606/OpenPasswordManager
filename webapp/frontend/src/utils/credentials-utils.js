export function sortCredentials(credentialsArray, sortValue) {
    if (sortValue === 0) {
        return credentialsArray.sort((a, b) => (a.name || "").toString().localeCompare((b.name || "").toString()))

    }
    else if (sortValue === 1) {
        return (credentialsArray.sort((a, b) => (a.name || "").toString().localeCompare((b.name || "").toString()))).sort().reverse()

    }
    else {
        return credentialsArray.sort((a, b) => b.id - a.id)
    }
}

export function extractHostname(url) {
    var hostname;

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
}

export function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

export function generateRandomPassword(
    length,
    useNumbers,
    useLowercase,
    useUppercase,
    useSpecialChars
) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()?_+-=.';

    let possibleChars = '';
    let password = '';

    if (useUppercase) {
        const randomUppercase =
            uppercaseChars[getRandomNumber(uppercaseChars.length)];
        possibleChars += uppercaseChars;
        password += randomUppercase;
    }

    if (useLowercase) {
        const randomLowercase =
            lowercaseChars[getRandomNumber(lowercaseChars.length)];
        possibleChars += lowercaseChars;
        password += randomLowercase;
    }

    if (useNumbers) {
        const randomNumber =
            numberChars[getRandomNumber(numberChars.length)];
        possibleChars += numberChars;
        password += randomNumber;
    }

    if (useSpecialChars) {
        const randomSpecialChar =
            specialChars[getRandomNumber(specialChars.length)];
        possibleChars += specialChars;
        password += randomSpecialChar;
    }

    const remainingChars = length - password.length;

    for (let i = 0; i < remainingChars; i++) {
        const randomChar =
            possibleChars[getRandomNumber(possibleChars.length)];
        password += randomChar;
    }
    password = password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return password;
}
export function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}
