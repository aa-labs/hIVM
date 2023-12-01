export const lexer = (input: string): string[] => {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("//"));
};
