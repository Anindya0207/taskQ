export const convertToByteArray = (str: string) => {
  const rawLength = str.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array;
};
