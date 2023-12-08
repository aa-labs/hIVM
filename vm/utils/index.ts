export const encodeToHex = (bytecode: string): string => {
  let hexString = "";
  for (let i = 0; i < bytecode.length; i++) {
    hexString += bytecode.charCodeAt(i).toString(16);
  }
  return hexString;
};

export const decodeFromHex = (hexString: string): string => {
  let str = "";
  for (let i = 0; i < hexString.length; i += 2) {
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return str;
};
