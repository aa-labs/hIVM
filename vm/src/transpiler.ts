import { hexlify } from "ethers/lib/utils";

interface ParsedToken {
  command: string;
  args: Record<string, string | string[]>;
}

const OP_CODES: Record<string, number> = {
  USE: 1,
  CONSOLIDATE: 2,
  SWAP: 3,
  CALL: 4,
};

const toHexString = (num: number): string => {
  return hexlify(num).slice(2);
};

const stringToHex = (str: string): string => {
  if (str.startsWith("0x")) {
    return str.slice(2);
  }

  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
};

export const transpile = (parsedTokens: ParsedToken[]): string => {
  let bytecodeParts: string[] = [];

  for (const token of parsedTokens) {
    let argsPart: string[] = [];
    const argsEntries = Object.entries(token.args).reverse();

    for (const [key, value] of argsEntries) {
      if (Array.isArray(value)) {
        for (let i = value.length - 1; i >= 0; i--) {
          argsPart.push(stringToHex(value[i]));
        }
        argsPart.push(value.length.toString());
      } else {
        argsPart.push(stringToHex(value));
      }
    }

    const opcode = toHexString(OP_CODES[token.command]);
    argsPart.push(opcode);

    bytecodeParts.push(argsPart.join("_"));
  }

  return "0x" + bytecodeParts.join("_");
};
