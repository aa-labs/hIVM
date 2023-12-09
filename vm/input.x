# practical-compiler

USE:
  ADDR -> 0xabcd

// this will get the required funds from all the chains to dest chain
CONSOLIDATE:
  CHAINS -> ARB, zkEVM, BASE
  DEST -> ARB
  VALUE -> 10

// swap from all assets to dests
SWAP:
  FROM -> ANY
  TO -> USDC
  VALUE -> 10
  SOURCE -> ARB

// call a random address with a method
CALL:
  ADDR -> 0x1234
  METHOD -> 0xashcdkhcbdhk
  VALUE -> 10
  SOURCE -> ARB
