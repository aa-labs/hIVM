const commandMap: Record<string, string> = {
  "01": "USE",
  "02": "CONSOLIDATE",
  "03": "SWAP",
  "04": "CALL",
};

const decodeHexString = (hexStr: string): string => {
  if (hexStr.length % 2 !== 0) {
    hexStr = "0" + hexStr;
  }
  let str = "";
  for (let i = 0; i < hexStr.length; i += 2) {
    const charCode = parseInt(hexStr.substring(i, i + 2), 16);
    if (charCode >= 32 && charCode < 127) {
      str += String.fromCharCode(charCode);
    } else {
      return hexStr;
    }
  }
  return str;
};

const executeBytecode = (hexBytecode: string): void => {
  hexBytecode = hexBytecode.startsWith("0x")
    ? hexBytecode.substring(2)
    : hexBytecode;
  const parts = hexBytecode.split("_");
  const decodedArray: string[] = [];

  parts.forEach((part) => {
    if (commandMap[part]) {
      decodedArray.push(commandMap[part]);
    } else {
      const decodedPart = decodeHexString(part);
      decodedArray.push(decodedPart);
    }
  });

  console.log("decoded array", decodedArray);
};

executeBytecode(
  "0xabcd_01_3130_415242_42415345_7a6b45564d_415242_3_02_3130_55534443_414e59_03_415242_3130_ashcdkhcbdhk_1234_04"
);
