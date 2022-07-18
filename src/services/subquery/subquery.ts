import config from '@/config/config';
import { notification } from 'antd';

const endpoints = config.main.subqueryServer;

export type AssetTransaction = {
  assetId: string
  block: string
  assetSymbol: string
  fromDid: string
  toDid: string
  amount: string
  timestampInSecond: number
};

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const doGraghQuery = async (query: string) => {
  const obj: any = {};
  obj.operationName = null;
  obj.variables = {};
  obj.query = query;
  return fetch(endpoints, {
    "headers": {
      "content-type": "application/json",
    },
    "body": JSON.stringify(obj),
    "method": "POST"
  });
};

export const OwnerDidOfNft = async (nftId: any) => {
  const query = `query {
    nfts(
      filter: { assetId: { equalTo: "${nftId}" } }
    ) {
      nodes {
        kolDid
      }
    }
  }`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.nfts.nodes[0].kolDid;
};

// 7 days 
export const AdvertisementRewards = async (ADid: string) => {
  const query = `query{
		advertisementRewards(
			filter:{
				id:{
						equalTo:"${ADid}"
				}
				timestampInSecond:{
						greaterThan: ${Math.round(Date.now() / 1000 - 60 * 60 * 24 * 7)}
				}
			}
		){
			nodes{
				reward
				award
				timestampInSecond
				createdAt
			}
		}
    }`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.advertisementRewards.nodes as any[];
};

// first 50
export const AssetTransactionHistory = async (did: string, stashAccount: string) => {
  const query = `query {
		assetTransactions(
			orderBy: TIMESTAMP_IN_SECOND_DESC
			first:50
			filter: 
			{ or: [{ fromDid: { equalTo: "${did}" } }, { toDid: { equalTo: "${did}" }}, { fromDid: { equalTo: "${stashAccount}" } }, { toDid: { equalTo: "${stashAccount}" }}] }) {
				nodes {
				block
				assetId
				fromDid
				toDid
				amount
				timestampInSecond
		}
		}
    }`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();

  const transactions = data.data.assetTransactions.nodes as AssetTransaction[];

  const assetIds: string[] = Array.from(new Set(transactions.map(asset => asset.assetId))).filter(id => id !== 'AD3');

  const symbols = [{ assetId: 'AD3', assetSymbol: 'AD3' }];
  
  if (assetIds.length) {
    const filterCondition = assetIds.map(id => `{ assetId: { equalTo: "${id}" }}`).join(',');
    const query = `query {
      nfts (
        filter: { or: [${filterCondition}]}
        )
          {
          nodes {
            assetId
            assetSymbol
          }
        }
    }`;

    const nftQuery = await doGraghQuery(query);
    const nftData = await nftQuery.json();

    // Network exception
    if (!nftData) {
      notification.error({
        key: 'networkException',
        message: 'Graph Query nfts Error',
        description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
        duration: null,
      });
    } else {
      symbols.push(...(nftData.data?.nfts?.nodes ?? []))
    }
  }

  transactions.forEach(tx => {
    tx.assetSymbol = symbols.find(nft => nft.assetId === tx.assetId)?.assetSymbol || '';
  });

  return transactions;
};

export const getChartsData = async (ADid: string, budget: bigint) => {
  const result = await AdvertisementRewards(ADid);

  if (!result) {
    return;
  }

  const tmp = { time: '', budget: 0, viewer: 0 };
  const data: any[] = [];
  const time: number[] = [];
  // 7 days timestamp
  for (let i = 7; i > 0; i--) {
    time.push(Date.now() / 1000 - 60 * 60 * 24 * i);
  }
  let cost = BigInt(0);
  let viewer = 0;
  let index = 0;
  for (let i = 0; i < result.length; i++) {
    cost += BigInt(result[i].reward?.replaceAll(',', ''));
    cost += BigInt(result[i].award?.replaceAll(',', ''));
    viewer++;
    const timestamp = result[i].timestampInSecond;
    tmp.time = formatTimestamp(timestamp);
    tmp.budget = Number(((budget - cost) / BigInt(1e18)).toString());
    //console.log(((budget - cost)/BigInt(1e18)))
    tmp.viewer = viewer;
    if ((Number(timestamp)) > time[index]) {
      data.push(tmp);
      index++;
    }
  }
  return data;
};

export const getAdViewerCounts = async (ADid: string) => {
  //{"data":{"advertisementRewards":{"totalCount":1}}}
  const query = `query{
		advertisementRewards(
			filter:{
				advertisementId:{
						equalTo:"${ADid}"
				}
			}
		){
			totalCount
		}
	}`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.advertisementRewards.totalCount as number;
};

export const getAdvertisementRefererCounts = async (ADid: string) => {
  const query = `query{
		advertisementRewards(filter:{
		id:{
			equalTo:"${ADid}"
		}
		refererDid:{
			notEqualTo:""
		}
		}){
			totalCount
		}
    }`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.advertisementRewards.totalCount as number;
};

export async function getStashOfDid(did: string) {
  const query = `query{
    did(id:"${did}"){
        stashAccount
      }
    }`;
  const res = await doGraghQuery(query);
  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.did.stashAccount;
}

//{ or: [{ fromDid: { equalTo: "${did}" } }, { toDid: { equalTo: "${did}" }}, { fromDid: { equalTo: "${stashAccount}" } }, { toDid: { equalTo: "${stashAccount}" }}] }
export const getAssetsList = async (did: string, stashAccount: string) => {
  const query = `query{
		members(
			filter: { or: [{ did: { equalTo:"${did}"}}, { did: { equalTo:"${stashAccount}"}}] }
		){
			nodes{
				id
				assetId
			}
		}	
	}`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.members.nodes as any[];
};