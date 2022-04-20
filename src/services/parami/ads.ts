import { GetPreferedNFT } from "./nft";

export const GetSlotAdOf = async (did: string): Promise<any> => {
    const id = await GetPreferedNFT(did);
    if (id.isEmpty) {
        return null;
    }
    const slot = await window.apiWs.query.ad.slotOf(id.toHuman());
    if (slot.isEmpty) {
        return null;
    }
    const res = slot.toHuman() as any;
    const ad = await window.apiWs.query.ad.metadata(res.ad);
    if (ad.isEmpty) {
        return null;
    }
    res.ad = ad.toHuman();
    return res;
};

export const GetEndtimeOf = async (adId: string) => {
    const res = await window.apiWs.query.ad.endtimeOf(adId);

    return res;
};