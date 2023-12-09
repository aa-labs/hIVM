import fs from "fs";
import { lexer } from "./src/lexer";
import { parser } from "./src/parser";
import { transpile } from "./src/transpiler";

const generateBytecode = (input: string): string => {
  const tokens = lexer(input);
  const parsed = parser(tokens);
  console.info("parsed tokens from lexer", parsed);
  return transpile(parsed);
};

const main = (filePath: string): void => {
  fs.readFile(filePath, "utf8", (err: any, data: any) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    const bytecode = generateBytecode(data);
    console.log({ bytecode });
  });
};

main("input.x");
