### practical-compiler

```bash
bun install
bun run index.ts
```

This is not compiler as such more like a transpiler

Lexer -> tokens -> Parser -> AST -> Transpiler

Lexer ->will read the file and tokenise with type and value
for us will be simple, just read a line and split(" ")

Parser / syntax analysis -> analyse the token structure
Generate AST (tough part)

Transpiler -> Use the AST to generate the output