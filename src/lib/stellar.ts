import {
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Networks,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import { signTransaction } from "./freighter";

const HORIZON_URL = "https://horizon-testnet.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

const USDC_ISSUER = "GBMMZMKVJGRKFNQ4SPYDXYB3Y6YZYUGIYAXI6K5YOKAFYYVHRCG6VZKK";
let _usdcAsset: Asset | null = null;
function getUsdcAsset(): Asset {
  if (!_usdcAsset) _usdcAsset = new Asset("USDC", USDC_ISSUER);
  return _usdcAsset;
}

export type Currency = "XLM" | "USDC";

export interface Balances {
  xlm: string;
  usdc: string;
}

export async function getBalances(publicKey: string): Promise<Balances> {
  const account = await server.loadAccount(publicKey);
  let xlm = "0";
  let usdc = "0";

  for (const b of account.balances) {
    if (b.asset_type === "native") {
      xlm = b.balance;
    } else if (
      b.asset_type === "credit_alphanum4" &&
      b.asset_code === "USDC" &&
      b.asset_issuer === USDC_ISSUER
    ) {
      usdc = b.balance;
    }
  }

  return { xlm, usdc };
}

export function getAsset(currency: Currency): Asset {
  return currency === "USDC" ? getUsdcAsset() : Asset.native();
}

export function isValidStellarAddress(address: string): boolean {
  if (!address || address.length !== 56) return false;
  if (!address.startsWith("G") && !address.startsWith("M")) return false;
  return /^[A-Z0-9]+$/.test(address);
}

export interface Recipient {
  address: string;
  amount: string;
}

export async function buildBatchPaymentTx(
  sourcePublicKey: string,
  recipients: Recipient[],
  currency: Currency = "XLM"
): Promise<string> {
  const account = await server.loadAccount(sourcePublicKey);
  const asset = getAsset(currency);

  const txBuilder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  });

  recipients.forEach(({ address, amount }) => {
    txBuilder.addOperation(
      Operation.payment({
        destination: address,
        asset,
        amount: amount,
      })
    );
  });

  const transaction = txBuilder.setTimeout(30).build();
  return transaction.toEnvelope().toXDR("base64");
}

export async function signAndSubmit(
  sourcePublicKey: string,
  recipients: Recipient[],
  currency: Currency = "XLM"
): Promise<{ hash: string }> {
  const xdr = await buildBatchPaymentTx(sourcePublicKey, recipients, currency);
  const signedXdr = await signTransaction(xdr);
  const transaction = TransactionBuilder.fromXDR(
    signedXdr,
    Networks.TESTNET
  );

  const result = await server.submitTransaction(transaction);
  return { hash: result.hash };
}

export function getExplorerUrl(hash: string): string {
  return `https://testnet.stellarchain.io/transactions/${hash}`;
}
