import { hexlify } from "ethers/lib/utils";

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

export const toHex = (value: string | number): string => {
  if (typeof value === "number") {
    return hexlify(value).slice(0, 1);
  } else {
    return value.startsWith("0x") ? value : encodeToHex(value);
  }
};
