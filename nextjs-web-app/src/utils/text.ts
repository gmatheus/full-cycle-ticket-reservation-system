export const capitalize = (text: string) =>
  (text && text[0].toUpperCase() + text.slice(1)) || "";

export const getHashCode = (str: string) =>
  [...str].reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0);
