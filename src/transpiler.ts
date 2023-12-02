interface ParsedToken {
  command: string;
  args: string[];
}

export const transpile = (parsedTokens: ParsedToken[]): string => {
  return parsedTokens
    .map((token) => {
      if (token.command === "BRIDGE") {
        // TODO: generate the tx logic here
        return `{ to: "${token.args[0]}", value: "0xabc" }`;
      } else if (token.command === "SWAP") {
        return `{ to: "${token.args[0]}", value: "0xdef" }`;
      }
      return "";
    })
    .join("\n");
};
