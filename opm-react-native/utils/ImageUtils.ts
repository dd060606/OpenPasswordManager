type Images = {
  images: {
    [key: string]: number;
  };
};

const images: Images = {
  images: {
    logo: require("app/assets/images/logo.png"),
    icon: require("app/assets/images/icon.png"),
    error: require("app/assets/images/error.png"),
  },
};

function getImageFromName(name: string): number {
  return images.images[name] ? (images.images[name] as number) : 0;
}
export { getImageFromName };
