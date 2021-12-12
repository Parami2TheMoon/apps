/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ArrowDownOutlined,
    AuditOutlined,
    InfoCircleOutlined,
    SendOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import Avatar from './Avatar';
import config from '@/config/config';
import styles from './Balance.less';
import SmallModal from '@/components/ParamiModal/SmallModal';
import AD3 from '@/components/Token/AD3';

const Balance: React.FC = () => {
    const [tipModal, setTipModal] = useState<boolean>(false);
    const { controller, stash } = useModel('balance');

    const intl = useIntl();

    return (
        <>
            <div className={styles.balanceCard}>
                <Avatar />
                <div className={styles.totalBalance}>
                    <div className={styles.amount}>
                        <AD3 value={stash?.total} />
                    </div>
                    <div className={styles.availableBalance}>
                        {intl.formatMessage({
                            id: 'wallet.balance.availableBalance',
                        })}
                        : <AD3 value={stash?.free} />
                        <InfoCircleOutlined
                            style={{
                                marginLeft: 10,
                            }}
                            onClick={() => { setTipModal(true) }}
                        />
                    </div>
                </div>
                <div className={styles.buttons}>
                    <div
                        className={styles.button}
                        onClick={() => {
                            history.push(config.page.sendPage);
                        }}
                    >
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            size="large"
                            className={styles.buttonContent}
                        />
                        <small>
                            {intl.formatMessage({
                                id: 'wallet.balance.send',
                            })}
                        </small>
                    </div>
                    <div
                        className={styles.button}
                        onClick={() => {
                            history.push(config.page.receivePage);
                        }}
                    >
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<ArrowDownOutlined />}
                            size="large"
                            className={styles.buttonContent}
                        />
                        <small>
                            {intl.formatMessage({
                                id: 'wallet.balance.receive',
                            })}
                        </small>
                    </div>
                    <div
                        className={styles.button}
                        onClick={() => {
                            history.push(config.page.buyPage);
                        }}
                    >
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<TagOutlined />}
                            size="large"
                            className={styles.buttonContent}
                        />
                        <small>
                            {intl.formatMessage({
                                id: 'wallet.balance.buy',
                            })}
                        </small>
                    </div>
                    <div
                        className={styles.button}
                        onClick={() => {
                            history.push(config.page.chargePage);
                        }}
                    >
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<AuditOutlined />}
                            size="large"
                            className={styles.buttonContent}
                        />
                        <small>
                            {intl.formatMessage({
                                id: 'wallet.balance.rechargeFee',
                            })}
                        </small>
                    </div>
                </div>
                <div className={styles.otherBalance}>
                    <div className={styles.field}>
                        <span className={styles.name}>
                            {intl.formatMessage({
                                id: 'wallet.balance.gas',
                            })}
                        </span>
                        <span className={styles.value}>
                            <AD3 value={controller?.free} />
                        </span>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.name}>
                            {intl.formatMessage({
                                id: 'wallet.balance.reservedBalance',
                            })}
                        </span>
                        <span className={styles.value}>
                            <AD3 value={stash?.reserved} />
                        </span>
                    </div>
                </div>
            </div>
            <SmallModal
                visable={tipModal}
                content={intl.formatMessage({
                    id: 'wallet.balance.availableBalance.tip',
                })}
                footer={
                    <Button
                        block
                        size='large'
                        shape='round'
                        onClick={() => { setTipModal(false) }}
                    >
                        {intl.formatMessage({
                            id: 'common.close',
                        })}
                    </Button>
                }
            />
        </>
    );
};

export default Balance;
