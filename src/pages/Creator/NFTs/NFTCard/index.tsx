import { NFTItem } from '@/models/nft';
import { formatWithoutUint } from '@/utils/common';
import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import style from './style.less';
import { Button, Progress, Tooltip } from 'antd';
import { BigIntToFloatString } from '@/utils/format';
import MintNFTModal from '../Mint';
import IdoModal from '../IdoModal/IdoModal';

const NFTCard: React.FC<{
    item: NFTItem;
}> = ({ item }) => {
    const [mintModal, setMintModal] = useState<boolean>(false);
    const [idoModal, setIdoModal] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const [coverHeight, setCoverHeight] = useState<number>();

    // const [totalAmount, totalUnlocked, currentlyCanClaim] = item.claimInfo ?? [];
    // const alreadyClaimed = (totalUnlocked && currentlyCanClaim) ? (BigInt(totalUnlocked) - BigInt(currentlyCanClaim)).toString() : '';

    useEffect(() => {
        setCoverHeight(ref.current?.offsetWidth);
    }, [ref.current]);

    // const statusInfo = (label: string, value: string, color: string) => {
    //     if (!value) {
    //         return;
    //     }
    //     return (<div className={style.status}>
    //         <div className={style.legend} style={{ background: `${color}` }}></div>
    //         <div className={style.label}>{label}</div>
    //         <div className={style.value}>{formatWithoutUint(value)}</div>
    //     </div>);
    // }

    return (<>
        <div
            className={`${style.nftItem} ${item.minted ? '' : style.unmint}`}
            onClick={() => {
                history.push(`/ad/?nftId=${item?.id}`);
            }}
        >
            <div className={style.card}>
                <div className={style.cardWrapper}>
                    <div className={style.cardBox}>
                        <div
                            className={style.cover}
                            style={{
                                backgroundImage: `url(${item?.tokenURI})`,
                                height: coverHeight,
                                minHeight: '20vh',
                            }}
                            ref={ref}
                        >
                            <div className={style.nftID}>
                                #{item?.id}
                            </div>
                        </div>
                        <div
                            className={style.filterImage}
                        />
                        <div className={style.cardDetail}>
                            <h3 className={style.text}>
                                {item?.name}
                            </h3>

                            {!item.minted && <>
                                <div className={style.action}>
                                    <Button
                                        block
                                        type='primary'
                                        shape='round'
                                        size='middle'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMintModal(true);
                                        }}
                                    >
                                        Mint
                                    </Button>
                                </div>
                            </>}

                            {/* <div className={style.status}>
                                <div className={style.label}>
                                    {intl.formatMessage({
                                        id: 'wallet.nfts.status',
                                        defaultMessage: 'Status',
                                    })}
                                </div>
                                <div className={style.value}>
                                    {item.minted ? 'Minted' : 'Rasing'}
                                </div>
                            </div>
                            {!item.minted && <>
                                <div className={style.action}>
                                    {item?.deposit >= FloatStringToBigInt('1000', 18) ? (
                                        <Button
                                            block
                                            type='primary'
                                            shape='round'
                                            size='middle'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMintModal(true);
                                            }}
                                        >
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.mint',
                                                defaultMessage: 'Mint',
                                            })}
                                        </Button>
                                    ) : (
                                        <Progress
                                            percent={
                                                parseFloat((Number(BigIntToFloatString(item?.deposit, 18)) / 1000 * 100).toFixed(2))
                                            }
                                            strokeColor='#ff5b00'
                                            className={style.progress}
                                        />
                                    )}
                                </div>
                            </>} */}

                            {item.minted && <>
                                <div className={style.status}>
                                    <div className={style.label}>
                                        Status
                                    </div>
                                    <div className={style.value}>
                                        Fundraising
                                    </div>
                                </div>
                                {/* {item.claimInfo?.length > 0 && (<>
                                    <div className={style.unlockProgress}>
                                        <Tooltip title="Tokens will be gradually unlocked over 6 months" color={'#ff5b00'}>
                                            <Progress
                                                success={{
                                                    percent: parseFloat((Number(BigIntToFloatString(alreadyClaimed, 18)) / Number(BigIntToFloatString(totalAmount, 18)) * 100).toFixed(2)),
                                                    strokeColor: '#ff5b00'
                                                }}
                                                percent={parseFloat((Number(BigIntToFloatString(totalUnlocked, 18)) / Number(BigIntToFloatString(totalAmount, 18)) * 100).toFixed(2))}
                                                strokeColor='#fc9860'
                                                showInfo
                                                className={style.progress}
                                            />
                                        </Tooltip>
                                    </div>
                                    {statusInfo('Total Value', totalAmount, '#fff')}
                                    {statusInfo('Total Claimed', alreadyClaimed, '#ff5b00')}
                                    {statusInfo('Ready for Claim', currentlyCanClaim, '#fc9860')}
                                </>)} */}

                                <div className={style.action}>
                                    <Button
                                        block
                                        type='primary'
                                        shape='round'
                                        size='middle'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIdoModal(true);
                                        }}
                                    >
                                        IDO
                                    </Button>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {idoModal && <>
            <IdoModal nftId={item.id} onClose={() => setIdoModal(false)} onIDO={() => {
                setIdoModal(false);
                // todo: refresh??
            }}></IdoModal>
        </>}

        {mintModal && <>
            <MintNFTModal item={item} onClose={() => setMintModal(false)} onMint={() => {
                setMintModal(false);
                // todo: jump to IPO page
            }}></MintNFTModal>
        </>}
    </>);
};

export default NFTCard;
