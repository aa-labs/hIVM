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


New changes ->
We dont wanna read file, what we need
- a method convert code to bytecode
- then use the bbytecode to generate the logic

For bytecode
- define bytecode opcodes
- compiler? method to convert code to bytecode (transpiler.ts)
- interpreter/executor/vm? method to execute bytecode