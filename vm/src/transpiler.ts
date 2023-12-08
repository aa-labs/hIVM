interface ParsedToken {
  command: string;
  args: Record<string, string | string[]>;
}

export const transpile = (parsedTokens: ParsedToken[]): string => {
  let bytecode = "";

  for (const token of parsedTokens) {
    bytecode += `${token.command}_`;

    for (const [key, value] of Object.entries(token.args)) {
      // NOTE: we don't need this as we don't want this to be part of the network
      // bytecode += `${key.toUpperCase()}_`;
      if (Array.isArray(value)) {
        bytecode += `${value.length}_`;
        for (const val of value) {
          bytecode += `${val}_`;
        }
      } else {
        bytecode += `${value}_`;
      }
    }
  }

  // TODO: confirm with ankur: if needs to be reversed 
  // for (const token of parsedTokens) {
  //   const argsEntries = Object.entries(token.args);
  //   for (let i = argsEntries.length - 1; i >= 0; --i) {
  //     const [key, value] = argsEntries[i];
  //     if (Array.isArray(value)) {
  //       for (let j = value.length - 1; j >= 0; --j) {
  //         bytecode.push(value[j]);
  //       }
  //       bytecode.push(value.length.toString());
  //       bytecode.push(key.toUpperCase());
  //     } else {
  //       bytecode.push(value);
  //       bytecode.push(key.toUpperCase());
  //     }
  //   }

  //   bytecode.push(token.command);
  // }

  return bytecode.slice(0, -1).trim();
};
