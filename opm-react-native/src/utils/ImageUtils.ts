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
    logo: require("../../assets/logo.png"),
  },
  icons: {
    key: require("../../assets/icons/key.png"),
    email: require("../../assets/icons/email.png"),
    eye: require("../../assets/icons/eye.png"),
    eyeSlash: require("../../assets/icons/eye-slash.png"),
  },
};

function getImageFromName(name: string): number {
  return images.images[name] ? (images.images[name] as number) : 0;
}
function getIconFromName(name: string): number {
  return images.icons[name] ? (images.icons[name] as number) : 0;
}

export { getIconFromName, getImageFromName };
