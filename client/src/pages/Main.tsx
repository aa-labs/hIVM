import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";
import { CovalentClient } from "@covalenthq/client-sdk";
// components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCallback, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { CircularProgress } from "@mui/material";
import { useSignMessage } from "wagmi";
import { showSuccessMessage } from "@/util";

const Main = () => {
  const classes = useStyles();
  const { signMessageAsync, isLoading } = useSignMessage();
  const [chains, setChains] = useState([
    {
      name: "Arb",
      tokens: [] as any,
      imageUrl: "/img/Arb.svg",
    },
    {
      name: "Polygon",
      tokens: [] as any,
      imageUrl: "/img/Polygon.svg",
    },
    {
      name: "Base",
      tokens: [] as any,
      imageUrl: "/img/Base.svg",
    },
  ]);
  const [doneTill, setDoneTill] = useState(0);
  const [pointerPosition, setPointerPosition] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [bytecode, setBytecode] = useState(
    "0x0D125Df38bFd6eAA2478052ABB7d7E62d2CF604B_01_3130_415242_42415345_415242_2_02_415242_37303030303030_55534443_414e59_03_415242_30_a14481940000000000000000000000000d125df38bfd6eaa2478052abb7d7e62d2cf604b00000000000000000000000000000000000000000000000000000000004c4b40_9CaeFEb398C3F2601Fb09E232f0a7eB37724b361_04"
  );
  const [transactionHashs, setTransactionHashs] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const client = new CovalentClient("ckey_7b58852d8d3a466ebb5306c717e");
      const urls = [
        client.BalanceService.getTokenBalancesForWalletAddress(
          "arbitrum-mainnet",
          "0x0D125Df38bFd6eAA2478052ABB7d7E62d2CF604B",
          { noSpam: true, noNftFetch: true }
        ),
        client.BalanceService.getTokenBalancesForWalletAddress(
          "polygon-zkevm-mainnet",
          "0x0D125Df38bFd6eAA2478052ABB7d7E62d2CF604B",
          { noSpam: true, noNftFetch: true }
        ),
        client.BalanceService.getTokenBalancesForWalletAddress(
          "base-mainnet",
          "0x0D125Df38bFd6eAA2478052ABB7d7E62d2CF604B",
          { noSpam: true, noNftFetch: true }
        ),
      ];

      const responses = await Promise.all(urls);
      const data = await Promise.all(
        responses.map((response) => response.data)
      );

      const updatedChains = chains.map((chain, index) => {
        const chainData = data[index];

        return {
          ...chain,
          tokens: chainData.items.map((item) => {
            // Check if balance is not null, otherwise default to BigInt(0)
            const balanceBigInt =
              item.balance !== null ? BigInt(item.balance) : BigInt(0);
            const balanceInEth =
              balanceBigInt / BigInt(Math.pow(10, item.contract_decimals));
            const formattedBalance = parseFloat(
              balanceInEth.toString()
            ).toFixed(2);

            return {
              name: item.contract_ticker_symbol,
              balance: formattedBalance, // Balance in ETH with up to 3 decimal places
              usdValue: item.pretty_quote,
            };
          }),
        };
      });

      setChains(updatedChains);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const fetchStatusFromRollup = useCallback(async () => {
    try {
      let rollupState = await fetch("http://localhost:3000/");
      const json = await rollupState.json();
      let pc = json.currentCount.byteCodes[0].programCounter + 1;
      // if ((pc = 1)) pc = 0;
      const pid = json.currentCount.byteCodes[0].id;

      const curByteCode = (json.currentCount.byteCodes[0].byteCode || "").split(
        "_"
      );
      let length = 0;
      for (let i = 0; i < pc; ++i) {
        length += curByteCode[i].length + 1;
      }
      length -= 1;
      // console.log(pointer);
      // console.log(json.currentCount.byteCodes[0].byteCode.slice(0, length - 1));
      setPointerPosition(length);
      console.log(length);

      // program counter logic
      if (pc >= 7) setDoneTill(2);
      if (pc >= 12) setDoneTill(3);
      if (pc >= 17) setDoneTill(4);

      // get tx data from rollup
      console.log(json.currentCount.transactions);
      const txArr = json.currentCount.transactions || [];
      console.log(txArr);
      setTransactionHashs(txArr);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchStatusFromRollup();
    fetchData();

    const interval = setInterval(() => {
      fetchStatusFromRollup();
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchStatusFromRollup, fetchData]);

  const buyNft = async () => {
    setLoading(true);
    const data = {
      type: "add", // imp
      id: 1,
      byteCode: bytecode, // imp
      programCounter: 0, // imp
      transactionData: {
        id: 4,
        type: "swap",
        hashs: "swap",
      },
    };
    const message = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes("Your message here")
    );
    const signature = await signMessageAsync({ message });
    console.log(signature);

    const wallet = new ethers.Wallet(
      "c036423371f04df762d41da48e70072efd687496f6715ea2da6a668a6d34a9fa"
    );
    const sign = await wallet._signTypedData(
      {
        name: "Stackr MVP v0",
        version: "1",
        chainId: 69420,
        verifyingContract: "0xe95157e7f6b65ccf3d7a2176d1162825a1436593",
        salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      },
      {
        TransactionData: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "type",
            type: "string",
          },
          {
            name: "hashs",
            type: "string",
          },
        ],
        "update-state": [
          {
            name: "type",
            type: "string",
          },
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "byteCode",
            type: "string",
          },
          {
            name: "programCounter",
            type: "uint256",
          },
          {
            name: "transactionData",
            type: "TransactionData",
          },
        ],
      },
      data
    );

    const payload = JSON.stringify({
      msgSender: wallet.address,
      signature: sign,
      payload: data,
    });

    const res = await fetch("http://localhost:3000/", {
      method: "POST",
      body: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setDoneTill(1);
    showSuccessMessage(json.ack._actionHash);
    setLoading(false);
  };

  return (
    <div className={classes.bgCover}>
      <Navbar />
      <div style={{ borderTop: "2px solid #88AB8E" }}></div>
      <div className={classes.market}>
        <div className={classes.leftSection}>
          <div className={classes.upperLeft}>
            <div style={{ margin: "10px auto" }}>
              <div className={classes.frame}>
                <img
                  src="img/nft.jpeg"
                  alt="NFT"
                  className={classes.nftImage}
                />
              </div>
              <button className={classes.btn} onClick={buyNft}>
                {Loading && (
                  <CircularProgress size={20} sx={{ marginRight: 1 }} />
                )}
                Buy the NFT
              </button>
            </div>

            <div className={classes.bytecodeContainer}>
              <div className={classes.bytecode}>
                Intent_Bytecode:
                <br />
                <br />
                <span className={classes.pointerIndicator}>
                  {bytecode.substring(0, pointerPosition + 1)}
                  {/* {bytecode[pointerPosition]} */}
                  {/* <div
                    className={classes.programCounter}
                    style={{ left: -4 + "px" }}
                  >
                    ↑
                  </div> */}
                </span>
                {bytecode.substring(pointerPosition + 1)}
              </div>
            </div>
          </div>

          <div className={classes.lowerLeft}>
            {chains.map((chain, chainIndex) => (
              <div key={chainIndex} className={classes.chainBox}>
                <div className={classes.chainTitle}>
                  <img
                    src={chain.imageUrl}
                    alt={`${chain.name} logo`}
                    style={{ height: "30px" }}
                  />
                  {chain.name}
                </div>
                <div className={classes.chainLine}></div>
                <div>
                  {chains.some((chain) => chain.tokens.length === 0) ? (
                    <div className={classes.tokenName}>Loading...</div>
                  ) : (
                    chain.tokens.map((token: any, tokenIndex: number) => (
                      <div key={tokenIndex} className={classes.tokenItem}>
                        <span className={classes.tokenName}>{token.name}</span>
                        {/* <span className={classes.tokenDetails}>
                          {token.balance}
                        </span> */}
                        <span className={classes.tokenDetails}>
                          {token.usdValue}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.rightSection}>
          <ul className={classes.stateList}>
            {states.map((state, index) => (
              <li
                key={index}
                className={index < doneTill ? "active" : ""}
                // style={index === states.length - 1 ? classes.lastListItem : ""}
              >
                <div className="title">{state.title}</div>
                <div className="description">{state.description}</div>
              </li>
            ))}

            <div className="title">Transaction Hash</div>
            <div className={classes.txHashBox}>
              {transactionHashs.map((txHashs) => {
                return txHashs.hashs
                  .split(",")
                  .map((txHash: string, index: number) => (
                    <div key={index} className={classes.txHash}>
                      -{" "}
                      <a href={txHash} style={{ textDecoration: "underline" }}>
                        {txHash}
                      </a>
                    </div>
                  ));
              })}
            </div>
          </ul>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-left" newestOnTop theme="dark" />
    </div>
  );
};

const states = [
  {
    title: "State 0: Intent Submission",
    description:
      "Your intent is submitted on the rollup. Solvers will start looking for transactions.",
  },
  {
    title: "State 1: Consolidate Processing",
    description:
      "A solver picked up the consolidation transaction, gathering funds across various chains to a destination chain.",
    transactions: [],
  },
  {
    title: "State 2: Swap Processing",
    description:
      "One solver processed your swaps, converting required asset to USDC.",
  },
  // {
  //   title: "State 3: Program counter updated",
  //   description:
  //     "After a solver picks and processes a transaction, updates are made on the rollup.",
  // },
  {
    title: "State 3: NFT Purchase Execution",
    description:
      "This whole program is solved by the solver. It concludes with the successful purchase of an NFT or completion of a call operation.",
  },
];

const useStyles = makeStyles(() => ({
  bgCover: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    backgroundColor: "#f6fefd",
    opacity: 0.9,
    background: "url(/img/background.svg) center 71px / auto repeat",
    // backgroundSize: "cover",
  },
  btn: {
    margin: "30px auto 0 auto",
    background: "#88AB8E",
    cursor: "pointer",
    border: 0,
    outline: "none",
    borderRadius: 5,
    height: "36px",
    fontSize: 18,
    lineHeight: "36px",
    padding: "0 18px 0 18px",
    borderBottom: "1px solid #000",
    display: "flex",
    alignItems: "center",
    color: "white",
    width: "max-content",

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      backgroundColor: "#6ba667",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },
  bytecodeContainer: {
    textAlign: "center",
    margin: "20px 0",
  },
  bytecode: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "5px",
    margin: "auto",
    fontFamily: "monospace",
    fontSize: "0.9em",
    // height: 70,
    // overflowX: "auto",
    width: "100%",
    wordBreak: "break-all",
  },
  programCounter: {
    margin: "10px 0",
    fontSize: "1.5em",
    position: "absolute",
  },
  pointerIndicator: {
    color: "green",
    fontSize: "1em",
    fontWeight: "bold",
    position: "relative",
  },
  market: {
    display: "flex",
    minHeight: "85vh",
    // margin: "0px auto",
    padding: "10px",
  },
  leftSection: {
    flex: 0.65,
    display: "flex",
    flexDirection: "column",
    borderRight: "2px solid #282b4c",
  },
  rightSection: {
    flex: 0.35,
    padding: 20,
    margin: "auto",
  },
  upperLeft: {
    flex: 0.75,
    display: "flex",
    flexDirection: "column",
    borderBottom: "2px solid #282b4c",
  },
  lowerLeft: {
    flex: 0.25,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px",
  },
  chainBox: {
    width: 250,
    height: "auto",
    minHeight: 150,
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",

    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  chainTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  chainLine: {
    width: "100%",
    height: "2px",
    backgroundColor: "#282b4c",
    marginBottom: "10px",
  },
  chainBalance: {
    textAlign: "center",
  },
  tokenItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "5px 0",
  },
  tokenName: {
    fontWeight: "normal",
    fontSize: "0.9em",
  },
  tokenDetails: {
    fontWeight: "normal",
    fontSize: "0.8em",
  },
  frame2: {
    margin: "auto",
  },
  // nft frame
  frame: {
    backgroundColor: "#ddc",
    border: "solid 1vmin #eee",
    borderBottomColor: "#fff",
    borderLeftColor: "#eee",
    borderRadius: "2px",
    borderRightColor: "#eee",
    borderTopColor: "#ddd",
    boxShadow:
      "0 0 2px 0 rgba(0,0,0,0.25) inset, 0 2px 4px 2px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
    display: "inline-block",
    margin: "10px auto",
    // height: "calc(300px + 16vmin)",
    padding: "20px",
    position: "relative",
    textAlign: "center",
  },
  nftImage: {
    width: 250,
    height: 250,
    border: "solid 2px",
    borderBottomColor: "#ffe",
    borderLeftColor: "#eed",
    borderRightColor: "#eed",
    borderTopColor: "#ccb",
  },
  stateList: {
    listStyle: "none",
    padding: 0,
    "& li": {
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "15px",
      marginBottom: "20px",
      backgroundColor: "#f7f7f7",
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: "100%",
        width: "2px",
        height: "20px",
        backgroundColor: "#ccc",
      },
      "&.active": {
        backgroundColor: "#dff0d8",
        borderColor: "green",
        "&:after": {
          backgroundColor: "green",
        },
      },
      "&:last-child:after": {
        display: "none",
      },
    },
    "& .title": {
      fontWeight: "bold",
      marginBottom: "10px",
    },
    "& .description": {
      fontSize: "0.9em",
      // lineHeight: "1.4",
      fontWeight: 400,
    },
  },
  txHashBox: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    fontSize: 14,
    marginTop: "10px",
    backgroundColor: "#f7f7f7",
    maxHeight: "200px", // Adjust as needed
    overflowY: "auto", // Allows scrolling if the content is too long
  },
  txHash: {
    marginBottom: "10px",
    wordBreak: "break-all", // Ensures long hashes don't overflow
  },
  txHashLink: {
    color: "#0645ad", // Link color, can be adjusted
    textDecoration: "none",
  },
  lastListItem: {
    position: "relative",
    "&:after": {
      display: "none",
    },
  },
}));

export default Main;
