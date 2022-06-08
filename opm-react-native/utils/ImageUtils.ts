type Images = {
  images: {
    [key: string]: number;
  };
};

const images: Images = {
  images: {
    logo: require("../assets/images/logo.png"),
    icon: require("../assets/images/icon.png"),
    error: require("../assets/images/error.png"),
  },
};

function getImageFromName(name: string): number {
  return images.images[name] ? (images.images[name] as number) : 0;
}
export { getImageFromName };
