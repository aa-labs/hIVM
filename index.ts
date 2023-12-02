import fs from "fs";
import { lexer } from "./src/lexer";
import { parse } from "./src/parser";
import { transpile } from "./src/transpiler";

const generateBytecode = (input: string): string => {
  const tokens = lexer(input);
  console.info({ tokens });
  const parsed = parse(tokens);
  console.info({ parsed });
  return transpile(parsed);
};

const executeBytecode = (bytecode: string): void => {
  const lines = bytecode.split("\n");
  for (const line of lines) {
    const [opcode, ...args] = line.split(" ");
    if (opcode === "BRIDGE") {
      // TODO: generate the tx logic here
      console.log({ to: args[0], value: "0xabc" });
    } else if (opcode === "SWAP") {
      console.log({ to: args[0], value: "0xdef" });
    }
  }
};

const main = (filePath: string): void => {
  fs.readFile(filePath, "utf8", (err: any, data: any) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    // genete bytecode
    const bytecode = generateBytecode(data);
    console.log({ bytecode });
    // execute bytecode
    executeBytecode(bytecode);
  });
};

main("input.x");
