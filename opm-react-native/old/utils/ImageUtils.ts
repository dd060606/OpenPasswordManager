type Images = {
  icons: {
    [key: string]: number;
  };
  images: {
    [key: string]: number;
  };
};

const images: Images = {
  images: {
    logo: require("../../assets/images/logo.png"),
    icon: require("../../assets/images/icon.png"),
  },
  icons: {
    key: require("../../assets/icons/key.png"),
    email: require("../../assets/icons/email.png"),
    eye: require("../../assets/icons/eye.png"),
    eyeSlash: require("../../assets/icons/eye-slash.png"),
    error: require("../../assets/icons/error.png"),
    name: require("../../assets/icons/name.png"),
    lock: require("../../assets/icons/lock.png"),
    settings: require("../../assets/icons/settings.png"),
    account: require("../../assets/icons/account.png"),
  },
};

function getImageFromName(name: string): number {
  return images.images[name] ? (images.images[name] as number) : 0;
}
function getIconFromName(name: string): number {
  return images.icons[name] ? (images.icons[name] as number) : 0;
}

export { getIconFromName, getImageFromName };
