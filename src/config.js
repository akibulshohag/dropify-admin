const imageBasePath =
  process.env.NODE_ENV === "development" ? `http://192.168.0.242:4311` : `http://192.168.0.242:4311`; // testing

// const imageBasePath = `https://apii.lazma.com`;

export default imageBasePath;
