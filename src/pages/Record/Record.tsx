import React, { useState } from 'react';
import { Card, Timeline, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import classNames from 'classnames';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { useEffect } from 'react';
import { AssetTransactionHistory } from '@/services/subquery/subquery';
import type { AssetTransaction } from '@/services/subquery/subquery';
import SimpleDateTime from 'react-simple-timestamp-to-date';
import { dealWithDid, hexToDid } from '@/utils/common';
import Token from '@/components/Token/Token';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import config from '@/config/config';
import { notification } from 'antd';

const All: React.FC<{
  allData: AssetTransaction[],
}> = ({ allData }) => {
  const { wallet } = useModel('currentUser');

  return (
    <>
      <Timeline className={style.timeline}>
        {allData.map((value) => {
          return (
            <Timeline.Item
              color={value.fromDid === wallet?.did ? "red" : "green"}
              dot={value.fromDid === wallet?.did ? <LogoutOutlined /> : <LoginOutlined />}
              className={style.timelineItem}
              key={value.timestampInSecond}
            >
              <div className={style.body}>
                <div className={style.left}>
                  <div className={style.desc}>
                    {value.fromDid === wallet?.did ? '-' : '+'}
                    <Token value={value.amount} symbol={value.assetSymbol} />
                  </div>
                  <div className={style.receiver}>
                    hash:<a onClick={() => { window.open(config.explorer.block + value.block, '_blank') }}>{value.block}</a>
                  </div>
                </div>
                <div className={style.right}>
                  <div className={style.address}>
                    <Tooltip
                      placement="topLeft"
                      title={dealWithDid(value, wallet.did!)}
                    >
                      {dealWithDid(value, wallet.did!)}
                    </Tooltip>
                  </div>
                  <div className={style.time}>
                    <SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
                  </div>
                </div>
              </div>
            </Timeline.Item>
          )
        })}
      </Timeline>
    </>
  )
}

const Send: React.FC<{
  allData: AssetTransaction[],
}> = ({ allData }) => {
  const { wallet } = useModel('currentUser');

  return (
    <>
      <Timeline className={style.timeline}>
        {allData.map((value) => value.fromDid === wallet?.did && (
          <Timeline.Item
            color="red"
            className={style.timelineItem}
            dot={<LogoutOutlined />}
          >
            <div className={style.body}>
              <div className={style.left}>
                <div className={style.desc}>
                  -<Token value={value.amount} symbol={value.assetSymbol} />
                </div>
                <div className={style.receiver}>
                  hash:<a onClick={() => { window.open(config.explorer.block + value.block, '_blank') }}>{value.block}</a>
                </div>
              </div>
              <div className={style.right}>
                <div className={style.address}>
                  <Tooltip placement="topLeft" title={value.toDid.indexOf('0x') >= 0 ? hexToDid(value.toDid) : value.toDid}>
                    {value.toDid.indexOf('0x') >= 0 ? hexToDid(value.toDid) : value.toDid}
                  </Tooltip>
                </div>
                <div className={style.time}>
                  <SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
                </div>
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  )
}

const Receive: React.FC<{
  allData: AssetTransaction[],
}> = ({ allData }) => {
  const { wallet } = useModel('currentUser');

  return (
    <>
      <Timeline className={style.timeline}>
        {allData.map((value) => value.toDid === wallet?.did && (
          <Timeline.Item
            color="green"
            className={style.timelineItem}
            dot={<LoginOutlined />}
          >
            <div className={style.body}>
              <div className={style.left}>
                <div className={style.desc}>
                  +<Token value={value.amount} symbol={value.assetSymbol} />
                </div>
                <div className={style.receiver}>
                  hash:<a onClick={() => { window.open(config.explorer.block + value.block, '_blank') }}>{value.block}</a>
                </div>
              </div>
              <div className={style.right}>
                <div className={style.address}>
                  <Tooltip placement="topLeft" title={value.fromDid.indexOf('0x') >= 0 ? hexToDid(value.fromDid) : value.fromDid}>
                    {value.fromDid.indexOf('0x') >= 0 ? hexToDid(value.fromDid) : value.fromDid}
                  </Tooltip>
                </div>
                <div className={style.time}>
                  <SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
                </div>
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  )
};

const Record: React.FC = () => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const [tab, setTab] = useState<string>('all');
  const [allData, setAllData] = useState<AssetTransaction[]>([]);

  const intl = useIntl();

  const getRecord = async () => {
    if (!!wallet && !!wallet.did) {
      try {
        const res: any = await AssetTransactionHistory(wallet?.did, `${wallet?.account}`);
        setAllData(res);
      } catch (e: any) {
        notification.error({
          key: 'unknownErorr',
          message: e.message || e,
          duration: null,
        });
      };
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      });
    }
  };

  useEffect(() => {
    if (apiWs) {
      getRecord();
    }
  }, [apiWs]);

  return (
    <>
      <div className={styles.mainTopContainer}>
        <div className={styles.pageContainer}>
          <Card
            className={styles.card}
            bodyStyle={{
              padding: 0,
              width: '100%',
            }}
          >
            <div className={styles.tabSelector}>
              <div
                className={classNames(styles.tabItem, tab === 'all' ? '' : styles.inactive)}
                onClick={() => setTab('all')}
              >
                {intl.formatMessage({
                  id: 'record.all',
                })}
              </div>
              <div
                className={classNames(styles.tabItem, tab === 'send' ? '' : styles.inactive)}
                onClick={() => setTab('send')}
              >
                {intl.formatMessage({
                  id: 'record.send',
                })}
              </div>
              <div
                className={classNames(styles.tabItem, tab === 'receive' ? '' : styles.inactive)}
                onClick={() => setTab('receive')}
              >
                {intl.formatMessage({
                  id: 'record.receive',
                })}
              </div>
            </div>
            <div className={style.recordList}>
              {tab === 'all' && (
                <All allData={allData} />

              )}
              {tab === 'send' && (
                <Send allData={allData} />
              )}
              {tab === 'receive' && (
                <Receive allData={allData} />
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Record;