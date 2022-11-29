import { deleteComma, BigIntToFloatString } from "@/utils/format";
import { web3FromSource } from "@polkadot/extension-dapp";
import { DecodeKeystoreWithPwd } from "./Crypto";
import { subCallback, subWeb3Callback } from "./Subscription";
import { Keyring } from '@polkadot/api';
import { checkFeeAndSubmitExtrinsic } from "@/utils/chain.util";

export const GetAdsListOf = async (did: Uint8Array): Promise<any> => {
  const res = await window.apiWs.query.ad.adsOf(did);
  const adList = res.toHuman() as any;
  const data: any[] = [];
  for (const adItem in adList) {
    const metadata = await window.apiWs.query.ad.metadata(adList[adItem]);
    data.push({
      id: adList[adItem],
      meta: metadata.toHuman(),
    });
  }
  return data;
};

export const GetSlotOfNft = async (nftId: string) => {
  const slot = await window.apiWs.query.ad.slotOf(nftId);
  if (slot.isEmpty) {
    return null;
  }
  const res = slot.toHuman() as any;
  return {
    ...res,
    fractionId: deleteComma(res.fractionId),
    fungibleId: deleteComma(res.fungibleId),
    nftId: deleteComma(res.nftId)
  };
}

export const GetSlotAdOf = async (nftId: string): Promise<any> => {
  const slot = await GetSlotOfNft(nftId);

  if (!slot) {
    return null;
  }

  const ad = await window.apiWs.query.ad.metadata(slot.adId);
  if (ad.isEmpty) {
    return null;
  }
  slot.ad = ad.toHuman();
  return slot;
};

export const GetSlotsOf = async (adID: string): Promise<any> => {
  const res = await window.apiWs.query.ad.slotsOf(adID);
  return res;
};

export const GetSlotAdOfByAssetID = async (assetID: string): Promise<any> => {
  const slot = await window.apiWs.query.ad.slotOf(assetID);
  if (slot.isEmpty) {
    return null;
  }
  const res = slot.toHuman();
  return res;
};

export const UserCreateAds = async (
  adConfig: any,
  password: string,
  keystore: string,
  preTx?: boolean,
  account?: string
) => {
  const currentBlockNum = await window.apiWs.query.system.number();
  const ex = window.apiWs.tx.ad.create(adConfig.tags, adConfig.metadata, adConfig.rewardRate, adConfig.lifetime + Number(currentBlockNum), adConfig.payoutBase, adConfig.payoutMin, adConfig.payoutMax, adConfig.delegatedAccount);

  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const UserBatchCreateAds = async (
  adConfigList: any[],
  password: string,
  keystore: string,
  preTx?: boolean,
  account?: string
) => {
  const currentBlockNum = await window.apiWs.query.system.number();
  const exList = adConfigList.map(adConfig => {
    return window.apiWs.tx.ad.create(adConfig.tags, adConfig.metadata, adConfig.rewardRate, adConfig.lifetime + Number(currentBlockNum), adConfig.payoutBase, adConfig.payoutMin, adConfig.payoutMax, adConfig.delegatedAccount);
  });

  const batch = await window.apiWs.tx.utility.batch(exList);
  
  if (preTx && account) {
    return await checkFeeAndSubmitExtrinsic(batch, password, keystore, preTx, account);
  }

  const info: any[] = [];
  for (let i = 0; i < exList.length; i++) {
    const ex = exList[i];
    const res = await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
    info.push(res);
  }
  return info;
}

export const CreateAds = async (adConfig, account) => {
  const currentBlockNum = await window.apiWs.query.system.number();
  const injector = await web3FromSource(account.meta.source);
  const tx = window.apiWs.tx.ad.create(adConfig.tags, adConfig.metadata, adConfig.rewardRate, adConfig.lifetime + Number(currentBlockNum), adConfig.payoutBase, adConfig.payoutMin, adConfig.payoutMax, adConfig.delegatedAccount);

  return await subWeb3Callback(tx, injector, account);
};

export const UserBidSlot = async (adId: string, nftId: string, amount: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.ad.bidWithFraction(adId, nftId, amount, null, null);

  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const UserBatchBidSlot = async (adId: string, bids: {nftId: string, amount: string}[], password: string, keystore: string, preTx?: boolean, account?: string) => {
  const exList = bids.map(bid => {
    return window.apiWs.tx.ad.bidWithFraction(adId, bid.nftId, bid.amount, null, null);
  })
  const ex = await window.apiWs.tx.utility.batch(exList);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const BidSlot = async (adId: string, nftID: string, amount: string, tokenAssetId: number | undefined, tokenAmount, account: any) => {
  const injector = await web3FromSource(account.meta.source);
  const tx = window.apiWs.tx.ad.bidWithFraction(adId, nftID, amount, tokenAssetId, tokenAmount);

  return await subWeb3Callback(tx, injector, account);
};

export const GetEndtimeOf = async (adId: string) => {
  const res = await window.apiWs.query.ad.endtimeOf(adId);

  return res;
};

export const BecomeAdvertiser = async (deposit: string, account: any) => {
  const injector = await web3FromSource(account.meta.source);
  const tx = window.apiWs.tx.advertiser.deposit(deposit);

  return await subWeb3Callback(tx, injector, account);
};

export const IsAdvertiser = async (account: string): Promise<boolean> => {
  const res = await window.apiWs.query.balances.reserves(account);
  const reserves: any = res.toHuman();
  for (const key in reserves) {
    if (reserves[key].id === 'prm/ader' && Number(BigIntToFloatString(deleteComma(reserves[key].amount), 18)) >= 1000) {
      return true;
    }
  }
  return false;
};

export const ClaimAdToken = async (adId: string, nftId: string, visitor: string, scores: (string | number)[][], referrer: string | null, signature: string, signer: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = await window.apiWs.tx.ad.claim(adId, nftId, visitor, scores, referrer, { Sr25519: signature.trim() }, signer.trim());

  return SubmitExtrinsic(ex, password, keystore, preTx, account);
};

export const ClaimAdTokenWithoutSignature = async (adId: string, nftId: string, scores: (string | number)[][] | null, referrer: string | null, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = await window.apiWs.tx.ad.claimWithoutAdvertiserSignature(adId, nftId, scores, referrer);

  return SubmitExtrinsic(ex, password, keystore, preTx, account);
}

const SubmitExtrinsic = async (ex: any, password: string, keystore: string, preTx?: boolean, account?: string) => {
  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const instanceKeyring = new Keyring({ type: 'sr25519' });
  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
}
