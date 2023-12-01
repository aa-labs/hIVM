import { lexer } from "./src/lexer";
import { parse } from "./src/parser";
import { transpile } from "./src/transpiler";
import fs from "fs";

const compile = (input: string): string => {
  const tokens = lexer(input);
  console.log(tokens);
  const parsed = parse(tokens);
  console.log(parsed)
  return transpile(parsed);
};

const compileFromFile = (filePath: string): void => {
  fs.readFile(filePath, "utf8", (err: any, data: any) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    const compiledCode = compile(data);
    console.log(compiledCode);
  });
};
compileFromFile('input.x');
