export const sizedImage = (url: string | undefined, width: number) => {
  if (!url) return "";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
  }
  return url;
};
