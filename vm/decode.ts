import { decodeFromHex } from "./utils";

const executeBytecode = (hexBytecode: string): void => {
  const bytecode = decodeFromHex(hexBytecode);
  const lines = bytecode.split("_");
  console.log("decoded array", lines);
};

executeBytecode("434f4e534f4c49444154455f335f4152425f7a6b45564d5f424153455f4152425f31305f535741505f414e595f555344435f31305f43414c4c5f3078313233345f736166654d696e745f3130");
