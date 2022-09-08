import config from "@/config/config";
import { GetAvatar } from "@/services/parami/HTTP";
import { GetUserInfo, DrylySellToken } from "@/services/parami/RPC";
import { OwnerDidOfNft, getAssetsList } from "@/services/subquery/subquery";
import { isLPAsset } from "@/utils/assets.util";
import { formatBalance } from "@polkadot/util";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useModel, history } from "umi";
import { tokenIconMap } from "./chainbridge";

export default () => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const [first] = useState((new Date()).getTime());
  const [assets, setAssets] = useState<Map<string, any>>(new Map());
  const [assetsArr, setAssetsArr] = useState<any[] | null>(null);

  const getAssets = async () => {
    if (!apiWs || !wallet?.account) {
      return;
    }

    const entries = await getAssetsList(wallet.account!);
    if (!!entries) {
      if (entries.length === 0) {
        setAssetsArr([]);
      }
      for (const entry of entries) {
        const metadataRaw = await apiWs.query.assets.metadata(entry?.assetId);
        const metadata: any = metadataRaw.toHuman();

        if (!!metadata && !isLPAsset(metadata)) {
          apiWs.query.assets.account(Number(entry?.assetId), wallet?.account, async (result: any) => {
            const { balance = '' } = result.toHuman() ?? {};
            const balanceBigInt = BigInt(balance.replaceAll(',', ''));
            if (!!balanceBigInt && balanceBigInt > 0) {
              let ad3, kol, icon;
              const did = await OwnerDidOfNft(entry?.assetId);
              if (did) {
                ad3 = await DrylySellToken(entry?.assetId, balanceBigInt.toString());
                kol = await GetUserInfo(did);

                if (!!kol?.avatar && kol?.avatar.indexOf('ipfs://') > -1) {
                  const hash = kol?.avatar.substring(7);
                  const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);

                  // Network exception
                  if (!response) {
                    notification.error({
                      key: 'networkException',
                      message: 'Network exception',
                      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
                      duration: null,
                    });
                  }

                  if (response?.status === 200) {
                    icon = window.URL.createObjectURL(data);
                  }
                }
              } else {
                icon = tokenIconMap[metadata.symbol];
              }

              let changes = BigInt(0);
              if (!assets.has(entry?.assetId)) {
                changes = balanceBigInt;
              } else {
                changes = balanceBigInt - BigInt(assets.get(entry?.assetId).balance);
              }

              // TODO: time events(first)
              if (((new Date()).getTime() - first >= 30000) && changes) {
                notification.success({
                  key: 'assetsChange',
                  message: `Changes in ${metadata?.name}, click for details`,
                  description: formatBalance(changes, { withUnit: metadata?.symbol }, 18),
                  onClick: () => {
                    history.push("/wallet");
                  }
                });
              }

              if (!!balanceBigInt && balanceBigInt > 0 && !isLPAsset(metadata)) {
                assets.set(entry?.assetId, {
                  id: entry?.assetId,
                  token: metadata?.name,
                  symbol: metadata?.symbol,
                  balance: balanceBigInt.toString(),
                  decimals: parseInt(metadata.decimals, 10),
                  isNftToken: !!did,
                  ad3: ad3 ? `${ad3}` : '',
                  icon,
                });
              }
            }


            setAssets(assets);
            setAssetsArr([...assets?.values()]);
          });
        }
      }
    }
    setAssets(assets);
    // setAssetsArr([...assets?.values()]);
  }

  useEffect(() => {
    if (apiWs) {
      getAssets();
    }
  }, [apiWs]);

  return { assets, assetsArr };
}