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

export async function getBalance(publicKey: string): Promise<string> {
  const account = await server.loadAccount(publicKey);
  const xlmBalance = account.balances.find(
    (b) => b.asset_type === "native"
  );
  return xlmBalance ? xlmBalance.balance : "0";
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
  recipients: Recipient[]
): Promise<string> {
  const account = await server.loadAccount(sourcePublicKey);

  const txBuilder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  });

  recipients.forEach(({ address, amount }) => {
    txBuilder.addOperation(
      Operation.payment({
        destination: address,
        asset: Asset.native(),
        amount: amount,
      })
    );
  });

  const transaction = txBuilder.setTimeout(30).build();
  return transaction.toEnvelope().toXDR("base64");
}

export async function signAndSubmit(
  sourcePublicKey: string,
  recipients: Recipient[]
): Promise<{ hash: string }> {
  const xdr = await buildBatchPaymentTx(sourcePublicKey, recipients);
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
