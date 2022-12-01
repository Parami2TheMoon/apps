import { message, notification, Spin, Tooltip } from 'antd';
import React, { useState } from 'react';
import style from './AdBubble.less';
import copy from 'copy-to-clipboard';
import { LoadingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import config from '@/config/config';

export interface AdBubbleVO {
    nftId: string;
    adId?: string;
    content?: string;
    tag?: string;
    poster?: string;
    claimed?: boolean;
    kolIcon?: string;
    assetName?: string;
    rewardAmount?: string;
    link?: string;
    score?: string;
}

export interface AdBubbleProps {
    ad: AdBubbleVO;
    userDid?: string;
    referrer?: string;
}

function AdBubble({ ad, userDid, referrer }: AdBubbleProps) {
    const [claiming, setClaiming] = useState<boolean>(false);
    const [adClaimed, setAdClaimed] = useState<boolean>(!!ad.claimed);

    const claim = async (redirect: boolean) => {
        setClaiming(true);
        try {
            if (redirect && ad.link) {
                window.open(decodeURIComponent(ad.link));
            }

            const body = {
                adId: ad.adId,
                nftId: ad.nftId,
                did: userDid,
                referrer: referrer,
                score: {
                    tag: ad.tag,
                    score: redirect ? ad.score : '-5'
                }
            };

            const res = await fetch(`${config.main.weeklySite}api/pay`, {
                "headers": {
                    "content-type": "application/json",
                },
                "body": JSON.stringify(body),
                "method": "POST",
            });

            setClaiming(false);

            if (res.ok) {
                setAdClaimed(true);
            } else {
                message.error({
                    content: 'Network Error. Please try again later.'
                })
            }
        } catch (e) {
            console.log('Ad claim error', e);
            setClaiming(false);
            message.error({
                content: 'Network Error. Please try again later.'
            })
        }
    }

    return <div className={style.adBubble}>
        <div className={`${style.adBubbleArrow} ${style.front}`}></div>
        <div className={`${style.adBubbleArrow} ${style.back}`}></div>
        <div className={style.adContent}>
            <div className={style.adDescription}>
                <span className={style.descriptionText}>{ad.content ?? 'View Ads. Get Paid.'}</span>
                {ad.tag && <span className={style.tags}>
                    <span className='tag'>#{ad.tag}</span>
                </span>}
            </div>
            {ad.poster && <>
                <Spin spinning={claiming} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Claiming...">
                    <div className={style.posterSection}>
                        <img
                            src={ad.poster}
                            referrerPolicy='no-referrer'
                            className={style.adPosterImg}
                        />

                        <div className={`${style.mask} ${adClaimed ? style.pinned : ''}`}>
                            <div>
                                <div className={style.infoText}>
                                    {!adClaimed ? 'You will be rewarded' : 'You have claimed'}
                                    <Tooltip title="Rewards are calculated based on your DID preference score">
                                        <span className={style.rewardInfoMark}><i className="fa-solid fa-circle-exclamation"></i></span>
                                    </Tooltip>
                                </div>

                                <div className={`${style.rewardRow}`}>
                                    <div className={`${style.rewardInfo}`} >
                                        <img referrerPolicy='no-referrer' className={style.kolIcon} src={ad.kolIcon ?? '/images/logo-square-core.svg'}></img>
                                        <span className={style.rewardAmount}>
                                            <span className={style.rewardNumber}>{ad.rewardAmount ?? '300.00'}</span>
                                            <span className={style.rewardToken}>{ad.assetName ?? 'XXX'} NFT Power</span>
                                        </span>
                                    </div>

                                    {adClaimed && <>
                                        <div className={style.claimedIcon}>
                                            <i className="fa-solid fa-circle-check"></i>
                                        </div>
                                    </>}
                                </div>

                                <div className={style.btnContainer}>
                                    {<>
                                        {adClaimed && <>
                                            <div className={`${style.actionBtn} ${style.left}`} onClick={() => {
                                                history.push(`/swap/${ad.nftId}`);
                                            }}>Buy more</div>
                                            <div className={`${style.actionBtn} ${style.right}`} onClick={async () => {
                                                copy(`${window.location.origin}/ad/?nftId=${ad.nftId}&referrer=${userDid}`)
                                                notification.success({
                                                    message: 'Referral link copied!'
                                                })
                                            }}>Share & Earn more</div>
                                        </>}

                                        {!adClaimed && <>
                                            <>
                                                <div className={`${style.actionBtn} ${style.left}`} onClick={() => {
                                                    claim(false);
                                                }}>Claim</div>
                                                <div className={`${style.actionBtn} ${style.right}`} onClick={() => {
                                                    claim(true);
                                                }}>Claim & Learn more</div>
                                            </>
                                        </>}
                                    </>}
                                </div>
                            </div>
                        </div>

                        {!adClaimed && <>
                            <div className={style.hoverHint}>
                                <div className={style.hintIcon}>
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                </div>
                            </div>
                        </>}
                    </div>
                </Spin>
            </>}
        </div>
    </div>;
};

export default AdBubble;
