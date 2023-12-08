const lexer = (input: string): string[][] => {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("//"))
    .reduce((acc: string[][], line: string) => {
      if (line.endsWith(":")) {
        acc.push([line]);
      } else if (acc.length > 0) {
        acc[acc.length - 1].push(line);
      }
      return acc;
    }, []);
};

export { lexer };
