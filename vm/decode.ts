import { decodeFromHex } from "./utils";

const executeBytecode = (hexBytecode: string): void => {
  const bytecode = decodeFromHex(hexBytecode);
  const lines = bytecode.split("_");
  console.log("decoded array", lines);
};

executeBytecode("0x01034152427a6b45564d42415345415242313002414e5955534443313003307831323334736166654d696e74313004307861626364");
