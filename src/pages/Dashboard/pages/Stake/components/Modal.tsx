import React from 'react';
import { useIntl } from 'umi';
import { Button, Input, Slider, Typography, Image } from 'antd';
import style from './Modal.less';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const AddModal: React.FC = () => {
    const intl = useIntl();

    const { Title } = Typography;

    const marks = {
        0.1: '0.1',
        1: '1',
        1.5: '1.5',
        2: '2',
    };

    return (
        <>
            <div className={style.modalContainer}>
                <Title
                    level={5}
                    className={style.title}
                >
                    {intl.formatMessage({
                        id: 'dashboard.stake.setPriceRange',
                        defaultMessage: 'Set Price Range',
                    })}
                </Title>
                <Slider
                    min={0.1}
                    max={2}
                    marks={marks}
                    step={null}
                    defaultValue={37}
                    className={style.slider}
                />
                <div className={style.rangeBlocks}>
                    <div className={style.block}>
                        <div className={style.blockBody}>
                            <span className={style.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.minPrice',
                                    defaultMessage: 'Min Price',
                                })}
                            </span>
                            <div className={style.control}>
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<MinusOutlined />}
                                />
                                <Input
                                    disabled
                                    placeholder='0.0'
                                    className={style.input}
                                    bordered={false}
                                    value={0.1}
                                />
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<PlusOutlined />}
                                />
                            </div>
                            <span className={style.rate}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.rateDesc',
                                    defaultMessage: '{from} per {to}',
                                }, {
                                    from: 'AD3',
                                    to: 'ETH',
                                })}
                            </span>
                        </div>
                    </div>
                    <div className={style.block}>
                        <div className={style.blockBody}>
                            <span className={style.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.maxPrice',
                                    defaultMessage: 'Max Price',
                                })}
                            </span>
                            <div className={style.control}>
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<MinusOutlined />}
                                />
                                <Input
                                    disabled
                                    placeholder='0.0'
                                    className={style.input}
                                    bordered={false}
                                    value={2}
                                />
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<PlusOutlined />}
                                />
                            </div>
                            <span className={style.rate}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.rateDesc',
                                    defaultMessage: '{from} per {to}',
                                }, {
                                    from: 'AD3',
                                    to: 'ETH',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={style.fullrange}>
                    <Button
                        block
                        disabled
                        size='middle'
                        shape='round'
                    >
                        {intl.formatMessage({
                            id: 'dashboard.stake.fullRange',
                            defaultMessage: 'Full Range',
                        })}
                    </Button>
                </div>
                <div className={style.gotoUniswap}>
                    <Button
                        block
                        size='large'
                        shape='round'
                        type='primary'
                        icon={
                            <Image
                                src='/images/crypto/uniswap-icon.svg'
                                height={'100%'}
                                preview={false}
                                style={{
                                    marginRight: 20
                                }}
                            />
                        }
                    >
                        {intl.formatMessage({
                            id: 'dashboard.stake.gotoUniswap',
                            defaultMessage: 'Goto Uniswap',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AddModal;
