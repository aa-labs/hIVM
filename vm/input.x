# practical-compiler

USE:
  ADDR -> 0x0D125Df38bFd6eAA2478052ABB7d7E62d2CF604B

// this will get the required funds from all the chains to dest chain
CONSOLIDATE:
  CHAINS -> ARB, BASE
  DEST -> ARB
  VALUE -> 10

// swap from all assets to dests
SWAP:
  FROM -> ANY
  TO -> USDC
  VALUE -> 5000000
  CHAIN -> ARB

// call a random address with a method
CALL:
  ADDR -> 0x9CaeFEb398C3F2601Fb09E232f0a7eB37724b361
  DATA -> 0xa14481940000000000000000000000000d125df38bfd6eaa2478052abb7d7e62d2cf604b00000000000000000000000000000000000000000000000000000000004c4b40
  VALUE -> 0
  CHAIN -> ARB
