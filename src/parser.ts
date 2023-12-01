interface ParsedToken {
  command: string;
  args: string[];
}

export const parse = (tokens: string[]): ParsedToken[] => {
  return tokens.map(token => {
      const parts = token.split(' ');
      return { command: parts[0], args: parts.slice(1) };
  });
};
