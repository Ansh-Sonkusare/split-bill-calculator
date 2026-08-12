import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction as freighterSign,
} from "@stellar/freighter-api";

export async function checkFreighterConnected(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}

export async function connectFreighter(): Promise<string> {
  const result = await requestAccess();
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.address;
}

export async function getFreighterAddress(): Promise<string | null> {
  try {
    const result = await getAddress();
    if (result.error) {
      return null;
    }
    return result.address;
  } catch {
    return null;
  }
}

export async function signTransaction(
  xdr: string
): Promise<string> {
  const result = await freighterSign(xdr, {
    networkPassphrase: "Test SDF Network ; September 2015",
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.signedTxXdr;
}
