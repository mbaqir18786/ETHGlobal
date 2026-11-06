import { decodeFunctionData, formatUnits, isAddress } from "viem";
import { DecodedTransaction } from "../types";

// Standard ERC-20 ABI fragments for decoding
const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

// Common token decimals mapping for clear UI display
const KNOWN_TOKENS: Record<string, { symbol: string; decimals: number }> = {
  // USDT
  "0xdac17f958d2ee523a2206206994597c13d831ec7": { symbol: "USDT", decimals: 6 },
  // USDC
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": { symbol: "USDC", decimals: 6 },
  // Sepolia USDC mock
  "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238": { symbol: "USDC (Sepolia)", decimals: 6 },
  // WBTC
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": { symbol: "WBTC", decimals: 8 },
};

/**
 * Decodes Safe transaction payloads into structured transfer parameters
 */
export function decodeSafeTransaction(tx: {
  to?: string;
  value?: string | number | bigint;
  data?: string;
}): DecodedTransaction {
  const rawTo = (tx.to || "").toLowerCase().trim();
  const rawData = (tx.data || "0x").trim();
  const rawValue = tx.value !== undefined ? tx.value.toString() : "0";

  // Validate target address
  if (!rawTo || !isAddress(rawTo)) {
    return {
      isSupported: false,
      transferType: "UNSUPPORTED",
      rawTo,
      rawData,
      rawValue,
      errorReason: "Missing or invalid destination address",
    };
  }

  // 1. Native ETH Transfer
  if (rawData === "0x" || rawData === "" || rawData.length <= 2) {
    const weiVal = BigInt(rawValue || 0);
    const ethAmount = (Number(weiVal) / 1e18).toFixed(4);

    return {
      isSupported: true,
      transferType: "NATIVE_ETH",
      recipient: rawTo,
      tokenSymbol: "ETH",
      amount: `${ethAmount} ETH`,
      rawTo,
      rawData,
      rawValue,
    };
  }

  // 2. MultiSend Batches Check (MultiSend Call Only / MultiSend)
  // Selector 0x8d80ff0a or known MultiSend contracts
  if (rawData.startsWith("0x8d80ff0a")) {
    return {
      isSupported: false,
      transferType: "UNSUPPORTED",
      rawTo,
      rawData,
      rawValue,
      errorReason: "MultiSend batch transactions are unsupported in MVP for lookalike analysis",
    };
  }

  // 3. ERC-20 transfer(address to, uint256 amount)
  // Selector: 0xa9059cbb
  if (rawData.startsWith("0xa9059cbb") && rawData.length >= 74) {
    try {
      const decoded = decodeFunctionData({
        abi: ERC20_ABI,
        data: rawData as `0x${string}`,
      });

      if (decoded.functionName === "transfer") {
        const [toArg, amountArg] = decoded.args as [string, bigint];
        const tokenMeta = KNOWN_TOKENS[rawTo] || { symbol: "ERC-20", decimals: 18 };
        const formattedAmount = formatUnits(amountArg, tokenMeta.decimals);

        return {
          isSupported: true,
          transferType: "ERC20_TRANSFER",
          recipient: toArg.toLowerCase(),
          tokenAddress: rawTo,
          tokenSymbol: tokenMeta.symbol,
          amount: `${formattedAmount} ${tokenMeta.symbol}`,
          rawTo,
          rawData,
          rawValue,
        };
      }
    } catch (err: any) {
      return {
        isSupported: false,
        transferType: "UNSUPPORTED",
        rawTo,
        rawData,
        rawValue,
        errorReason: `Failed to decode ERC-20 transfer: ${err.message}`,
      };
    }
  }

  // 4. ERC-20 transferFrom(address from, address to, uint256 amount)
  // Selector: 0x23b872dd
  if (rawData.startsWith("0x23b872dd") && rawData.length >= 138) {
    try {
      const decoded = decodeFunctionData({
        abi: ERC20_ABI,
        data: rawData as `0x${string}`,
      });

      if (decoded.functionName === "transferFrom") {
        const [, toArg, amountArg] = decoded.args as [string, string, bigint];
        const tokenMeta = KNOWN_TOKENS[rawTo] || { symbol: "ERC-20", decimals: 18 };
        const formattedAmount = formatUnits(amountArg, tokenMeta.decimals);

        return {
          isSupported: true,
          transferType: "ERC20_TRANSFER_FROM",
          recipient: toArg.toLowerCase(),
          tokenAddress: rawTo,
          tokenSymbol: tokenMeta.symbol,
          amount: `${formattedAmount} ${tokenMeta.symbol}`,
          rawTo,
          rawData,
          rawValue,
        };
      }
    } catch (err: any) {
      return {
        isSupported: false,
        transferType: "UNSUPPORTED",
        rawTo,
        rawData,
        rawValue,
        errorReason: `Failed to decode ERC-20 transferFrom: ${err.message}`,
      };
    }
  }

  // 5. Any generic contract call
  return {
    isSupported: false,
    transferType: "UNSUPPORTED",
    rawTo,
    rawData,
    rawValue,
    errorReason: "Generic smart contract interaction or unsupported call format",
  };
}

