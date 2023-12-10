import { RollupState, STF } from "@stackr/stackr-js/execution";
import { ethers, hexlify, toUtf8Bytes, keccak256 } from "ethers";

interface TransactionEntry {
  id: number;
  type: "consolidate" | "swap" | "call";
  hashs: string;
}
interface ByteCodeEntry {
  id: number;
  byteCode: string;
  programCounter: number;
}
export type StateVariable = {
  byteCodes: ByteCodeEntry[];
  transactions: TransactionEntry[];
};

interface StateTransport {
  state: StateVariable;
}

export interface ByteCodeActionInput {
  type: "add" | "update";
  id: number;
  byteCode: string;
  programCounter: number;
}

export interface TransactionActionInput {
  type: "addTransaction" | "updateTransaction";
  transactionData: {
    id: number;
    type: "consolidate" | "swap" | "call";
    hashs: string;
  };
}

export class ByteCodeRollup extends RollupState<StateVariable, StateTransport> {
  constructor(byteCodes: StateVariable) {
    super(byteCodes);
  }

  createTransport(state: StateVariable): StateTransport {
    return {
      state: {
        byteCodes: state.byteCodes,
        transactions: state.transactions,
      },
    };
  }

  getState(): StateVariable {
    return this.transport.state;
  }

  calculateRoot(): ethers.BytesLike {
    const concatenatedByteCodes = (this.transport.state.byteCodes || [])
      .map((bc) => bc.byteCode)
      .join("");

    const hexByteCodes = hexlify(toUtf8Bytes(concatenatedByteCodes));

    return keccak256(hexByteCodes);
  }
}

export const byteCodeSTF: STF<
  ByteCodeRollup,
  ByteCodeActionInput | TransactionActionInput
> = {
  identifier: "byteCodeSTF",

  apply(
    input: ByteCodeActionInput | TransactionActionInput,
    state: ByteCodeRollup
  ): void {
    let newState = state.getState();
    if (newState.byteCodes === undefined) newState.byteCodes = [];
    if (newState.transactions === undefined) newState.transactions = [];
    console.log("imphere1", newState);
    if (input.type === "add" || input.type === "update") {
      console.log("imphere2", newState);
      switch (input.type) {
        case "add":
          if (input.byteCode) {
            newState.byteCodes.push({
              id: newState.byteCodes.length + 1,
              byteCode: input.byteCode,
              programCounter: 0,
            });
          }
          break;
        case "update":
          if (input.id && input.programCounter !== undefined) {
            const index = newState.byteCodes.findIndex(
              (bc) => bc.id === input.id
            );
            if (index !== -1) {
              newState.byteCodes[index].programCounter = input.programCounter;
            }
          }
          break;
        default:
          throw new Error("Invalid action type for bytecode");
      }
      state.transport.state.byteCodes = newState.byteCodes;
    }

    console.log("imphere", newState);
    if (input.type === "addTransaction" || input.type === "updateTransaction") {
      switch (input.type) {
        case "addTransaction":
          newState.transactions.push(input.transactionData);
          break;
        case "updateTransaction":
          // TODO: confirm with ankur if needed
          break;
        default:
          throw new Error("Invalid action type for transaction");
      }
      state.transport.state.transactions = newState.transactions;
    }
  },
};
