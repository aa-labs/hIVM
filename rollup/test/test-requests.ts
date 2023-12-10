import { ethers } from "ethers";
import { stackrConfig } from "../stackr.config";
import { ActionSchema } from "@stackr/stackr-js";

const actionInput = new ActionSchema("update-state", {
  type: "String",
  id: "Uint",
  byteCode: "String",
  programCounter: "Uint",
  transactionData: {
    id: "Uint",
    type: "String",
    hashs: "String",
  },
});

const getPayload = async (actionData: any) => {
  const wallet = new ethers.Wallet(
    stackrConfig.operator.accounts[0].privateKey
  );
  // console.log("veryimp>", actionInput.EIP712TypedData.types);
  const sign = await wallet.signTypedData(
    stackrConfig.domain,
    actionInput.EIP712TypedData.types,
    actionData
  );

  return JSON.stringify({
    msgSender: wallet.address,
    signature: sign,
    payload: actionData,
  });
};

const addByteCode = async () => {
  const data = {
    type: "add",
    id: 5, // doesnt matter
    byteCode:
      "0x0D125Df38bFd6eAA2478052ABB7d7E62d2CF604B_01_313030_415242_42415345_415242_2_02_415242_3135303030303030_55534443_414e59_03_415242_30_a14481940000000000000000000000000d125df38bfd6eaa2478052abb7d7e62d2cf604b0000000000000000000000000000000000000000000000000000000000e4e1c0_9CaeFEb398C3F2601Fb09E232f0a7eB37724b361_04",
    programCounter: 0, // doesnt matter
    transactionData: {
      // doesnt matter
      id: 5, // doesnt matter
      type: "add", // doesnt matter
      hashs: "abc", // doesnt matter
    },
  };
  return getPayload(data);
};

const addTransaction = async () => {
  const data = {
    type: "addTransaction",
    id: 5,
    byteCode: "your_byte_code_here",
    programCounter: 0,
    transactionData: {
      id: 4,
      type: "swap",
      hashs: "swap",
    },
  };
  return getPayload(data);
};

const updateProgramCounter = async () => {
  const data = {
    type: "update",
    id: 1,
    byteCode: Math.ceil(Math.random() * 10000).toString(),
    programCounter: 0,
    transactionData: {
      id: 100,
      type: "add",
      hashs: "abc",
    },
  };
  return getPayload(data);
};

const run = async (payload: string) => {
  const start = Date.now();

  const res = await fetch("http://localhost:3000/", {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const end = Date.now();

  const json = await res.json();

  const elapsedSeconds = (end - start) / 1000;
  const requestsPerSecond = 1 / elapsedSeconds;

  console.log(`Requests per second: ${requestsPerSecond.toFixed(2)}`);
  console.log("response : ", json);
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (let i = 0; i < 1; ++i) {
  // const addCode = await addByteCode();
  // console.log(addCode);
  // await run(addCode);

  // await delay(2000);

  const updateCode = await updateProgramCounter();
  await run(updateCode);

  // await delay(2000);

  // const addTransactions = await addTransaction();
  // await run(addTransactions);
}
