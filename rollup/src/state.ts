import { RollupState, STF } from "@stackr/stackr-js/execution";
import { ethers, hexlify, toUtf8Bytes, keccak256 } from "ethers";

export type StateVariable = {
  id: number;
  byteCode: string;
}[];

interface StateTransport {
  byteCodes: StateVariable;
}

export interface ByteCodeActionInput {
  type: "add" | "update";
  id?: number;
  byteCode?: string;
}

export class ByteCodeRollup extends RollupState<StateVariable, StateTransport> {
  constructor(byteCodes: StateVariable) {
    super(byteCodes);
  }

  createTransport(state: StateVariable): StateTransport {
    return { byteCodes: state };
  }

  getState(): StateVariable {
    return this.transport.byteCodes;
  }

  calculateRoot(): ethers.BytesLike {
    const concatenatedByteCodes = this.transport.byteCodes
      .map((bc) => bc.byteCode)
      .join("");

    const hexByteCodes = hexlify(toUtf8Bytes(concatenatedByteCodes));

    return keccak256(hexByteCodes);
  }
}

export const byteCodeSTF: STF<ByteCodeRollup, ByteCodeActionInput> = {
  identifier: "byteCodeSTF",

  apply(input: ByteCodeActionInput, state: ByteCodeRollup): void {
    let newState = state.getState();

    switch (input.type) {
      case "add":
        if (input.byteCode) {
          newState.push({ id: newState.length + 1, byteCode: input.byteCode });
        }
        break;
      case "update":
        if (input.id && input.byteCode) {
          const index = newState.findIndex((bc) => bc.id === input.id);
          if (index !== -1) {
            newState[index].byteCode = input.byteCode;
          }
        }
        break;
      default:
        throw new Error("Invalid action type");
    }

    state.transport.byteCodes = newState;
  },
};
