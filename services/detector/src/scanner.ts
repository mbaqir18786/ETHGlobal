import {
  createPublicClient,
  http,
  fallback,
  parseAbiItem,
  formatUnits,
  Address,
} from "viem";
import { mainnet } from "viem/chains";
import { CONFIG } from "./config";
import { TransactionPayload } from "./types";
import { AddressPoisoningDetector } from "./engine";

// ERC-20 Transfer Event ABI
const TRANSFER_EVENT_ABI = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

export interface ScanOptions {
  fromBlock?: bigint;
  toBlock?: bigint;
  blockCount?: number;
  tokens?: Array<keyof typeof CONFIG.TOKEN_CONTRACTS>;
  rpcUrl?: string;
}

export class EthereumMainnetLogScanner {
  private client: ReturnType<typeof createPublicClient>;
  private detector: AddressPoisoningDetector;

  constructor(rpcUrl?: string) {
    const transports = [
      http(rpcUrl || CONFIG.ETH_RPC_URL),
      ...CONFIG.FALLBACK_RPC_URLS.map((url) => http(url)),
    ];

    this.client = createPublicClient({
      chain: mainnet,
      transport: fallback(transports),
    });

    this.detector = new AddressPoisoningDetector();
  }

  /**
   * Scans recent blocks for USDT & USDC Transfer logs
   */
  public async scanRecentTransferLogs(options: ScanOptions = {}): Promise<{
    scannedBlocks: { from: bigint; to: bigint };
    totalLogsFound: number;
    suspiciousLogs: TransactionPayload[];
  }> {
    const currentBlock = await this.client.getBlockNumber();
    const blockCount = BigInt(options.blockCount || 5);
    const fromBlock = options.fromBlock || currentBlock - blockCount;
    const toBlock = options.toBlock || currentBlock;

    const tokensToScan = options.tokens || (["USDT", "USDC"] as const);
    const suspiciousLogs: TransactionPayload[] = [];
    let totalLogsFound = 0;

    for (const tokenKey of tokensToScan) {
      const tokenConfig = CONFIG.TOKEN_CONTRACTS[tokenKey];

      try {
        const logs = await this.client.getLogs({
          address: tokenConfig.address as Address,
          event: TRANSFER_EVENT_ABI,
          fromBlock,
          toBlock,
        });

        totalLogsFound += logs.length;

        for (const log of logs) {
          const { from, to, value } = log.args;
          if (!from || !to || value === undefined) continue;

          const decimalAmount = formatUnits(value, tokenConfig.decimals);
          const numAmount = parseFloat(decimalAmount);

          // Identify candidate zero-value or dust transfers
          const isZero = value === 0n || numAmount === 0;
          const isDust = numAmount > 0 && numAmount <= CONFIG.THRESHOLDS.MAX_DUST_USD_VALUE;

          if (isZero || isDust) {
            suspiciousLogs.push({
              txHash: log.transactionHash,
              fromAddress: from,
              toAddress: to,
              token: tokenConfig.symbol,
              tokenContractAddress: tokenConfig.address,
              amount: decimalAmount,
              blockNumber: Number(log.blockNumber),
              blockTimestamp: Math.floor(Date.now() / 1000), // Approximate block timestamp
            });
          }
        }
      } catch (err) {
        console.warn(`⚠️ [Scanner] Log retrieval failed for ${tokenKey}:`, err);
      }
    }

    return {
      scannedBlocks: { from: fromBlock, to: toBlock },
      totalLogsFound,
      suspiciousLogs,
    };
  }

  /**
   * Fetches latest block number
   */
  public async getLatestBlockNumber(): Promise<bigint> {
    return this.client.getBlockNumber();
  }

  public getDetector(): AddressPoisoningDetector {
    return this.detector;
  }
}

