import { hexlify } from "ethers/lib/utils";

interface ParsedToken {
  command: string;
  args: Record<string, string | string[]>;
}

const commandMap: Record<string, number> = {
  CONSOLIDATE: 1,
  SWAP: 2,
  CALL: 3,
  USE: 4,
};

const toHexString = (num: number): string => {
  return hexlify(num).slice(2);
};

const stringToHex = (str: string): string => {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
};

export const transpile = (parsedTokens: ParsedToken[]): string => {
  let bytecodeParts: string[] = [];

  for (const token of parsedTokens) {
    const commandCode = commandMap[token.command];
    bytecodeParts.push(toHexString(commandCode) + "_");

    for (const [key, value] of Object.entries(token.args)) {
      if (Array.isArray(value)) {
        bytecodeParts.push(toHexString(value.length) + "_");

        for (const val of value) {
          bytecodeParts.push(stringToHex(val) + "_");
        }
      } else {
        bytecodeParts.push(stringToHex(value) + "_");
      }
    }
  }

  // Concatenate all parts
  return "0x" + bytecodeParts.join("");
};
