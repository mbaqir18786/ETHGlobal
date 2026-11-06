import { DustMetrics } from "../types";

/**
 * Evaluates whether a transaction is a zero-value exploit or micro-dust spam
 */
export function evaluateDust(
  tokenSymbol: string,
  rawAmount: string
): DustMetrics & { dustScore: number } {
  const normalizedToken = tokenSymbol.toUpperCase();
  const numAmount = parseFloat(rawAmount) || 0;

  // Zero-value transfer pattern: Transfer(from, to, 0)
  const isZeroValue = numAmount === 0 || rawAmount === "0" || rawAmount === "0.0";

  let estimatedUsdValue = 0;
  let isDustAmount = false;
  let dustScore = 0;

  // Estimate USD value and dust threshold based on asset
  switch (normalizedToken) {
    case "ETH":
    case "WETH":
      estimatedUsdValue = numAmount * 3500;
      isDustAmount = numAmount > 0 && numAmount <= 0.05; // <= 0.05 ETH (typical dusting attack)
      break;

    case "USDT":
    case "USDC":
    case "DAI":
      estimatedUsdValue = numAmount;
      isDustAmount = numAmount > 0 && numAmount <= 0.05; // <= $0.05
      break;

    case "WBTC":
    case "BTC":
      estimatedUsdValue = numAmount * 65000;
      isDustAmount = numAmount > 0 && numAmount <= 0.00001; // <= $0.65
      break;

    default:
      // Generic token fallback
      estimatedUsdValue = numAmount;
      isDustAmount = numAmount > 0 && numAmount <= 0.001;
      break;
  }

  if (isZeroValue) {
    // Zero-value transfers are almost exclusively used for balance feed poisoning
    dustScore = 95;
  } else if (isDustAmount) {
    // Dust amounts are typical for poisoning injections
    dustScore = 80;
  } else if (estimatedUsdValue > 100) {
    // Meaningful capital transfer has 0 dust score
    dustScore = 0;
  } else {
    // Sub-$10 transfers have slight suspicion
    dustScore = 20;
  }

  return {
    isZeroValue,
    isDustAmount,
    rawAmount,
    estimatedUsdValue,
    dustScore,
  };
}
