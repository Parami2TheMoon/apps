import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Button, Image, Input, message, notification, Tooltip } from 'antd';
import style from './style.less';
import { ArrowDownOutlined, PlusOutlined } from '@ant-design/icons';
import { AD3ToETH } from '@/services/parami/bridge';
import { isETHAddress } from '@/utils/checkAddress';
import { BigNumber } from 'ethers';
import AD3 from '@/components/Token/AD3';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';

const Withdraw: React.FC<{
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setStep: React.Dispatch<React.SetStateAction<number>>;
	setETHHash: React.Dispatch<React.SetStateAction<string | undefined>>;
	setParamiHash: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ setLoading, setStep, setETHHash, setParamiHash }) => {
	const apiWs = useModel('apiWs');
	const {
		Account,
		ChainName,
		Provider,
		Signer,
	} = useModel('web3');
	const { DepositNonce, DataHash, SubBridgeEvents, UnsubBridgeEvents } = useModel('dashboard.bridgeEvents');
	const { stash } = useModel('dashboard.balance');
	const { Ad3Contract, BridgeContract } = useModel('contracts');
	const [freeBalance, setFreeBalance] = useState<string>('');
	const [txNonce, setTxNonce] = useState<bigint>(BigInt(0));
	const [amount, setAmount] = useState<string>('');
	const [destinationAddress, setDestinationAddress] = useState<string>();

	const intl = useIntl();

	const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

	const getBalance = async () => {
		if (!Provider || !Signer) return;
		try {
			const balance = await Ad3Contract?.balanceOf(Account);
			setFreeBalance(BigNumber.from(balance).toString());
		} catch (e: any) {
			notification.error({
				message: e.message || e,
				duration: null,
			});
		}
	};

	const handleSubmit = async () => {
		if (!Provider || !Signer) return;

		if (!isETHAddress(destinationAddress)) {
			message.error('Please input ETH Address!');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const paramiRes: any = await AD3ToETH(JSON.parse(currentAccount), FloatStringToBigInt(amount, 18).toString(), destinationAddress as string);
			setTxNonce(BigInt(paramiRes.chainBridge.FungibleTransfer[0][1]));
			setParamiHash(paramiRes.chainBridge.FungibleTransfer[0][0]);
			setStep(2);

			if (BridgeContract) {
				SubBridgeEvents(BridgeContract);
			} else {
				notification.error({
					message: 'No bridge contract',
				});
			};
		} catch (e: any) {
			notification.error({
				message: e.message || e,
				duration: null,
			});
			setLoading(false);
		}
	};

	useEffect(() => {
		if (DepositNonce === txNonce) {
			setStep(3);
			setTxNonce(BigInt(0));
			notification.success({
				message: 'Withdraw Success',
			});
			if (DataHash) {
				setETHHash(DataHash);
			};
			if (BridgeContract) {
				UnsubBridgeEvents(BridgeContract);
			}
		}
	}, [BridgeContract, DepositNonce, UnsubBridgeEvents, txNonce, DataHash]);

	useEffect(() => {
		if (!Account || !Ad3Contract) return;
		if (apiWs) {
			getBalance();
		}
	}, [Signer, Provider, Ad3Contract, Account, apiWs]);

	return (
		<>
			<div className={style.fromLabel}>
				{intl.formatMessage({
					id: 'dashboard.bridge.from',
					defaultMessage: 'From',
				})}
			</div>
			<div className={style.formSection}>
				<div className={style.chainAndBalanceDetails}>
					<div className={style.chainDetails}>
						<Image
							src='/images/logo-core-colored-fit-into-round.svg'
							preview={false}
							className={style.chainIcon}
						/>
						<span className={style.chainDetailsChainName}>Parami chain</span>
					</div>
					<div className={style.balanceDetails}>
						<span className={style.balanceDetailsLabel}>
							{intl.formatMessage({
								id: 'dashboard.bridge.balance',
								defaultMessage: 'Balance',
							})}:
						</span>
						<Tooltip placement="top" title={BigIntToFloatString(stash.total, 18)}>
							<span className={style.balanceDetailsBalance}>
								<AD3 value={stash.total} />
							</span>
						</Tooltip>
					</div>
				</div>
				<div className={style.tokenAndAmountDetails}>
					<div className={style.tokenDetails}>
						<Image
							src='/images/logo-round-core.svg'
							preview={false}
							className={style.chainIcon}
						/>
						<span className={style.tokenDetailsTokenName}>AD3</span>
					</div>
					<div className={style.amountDetails}>
						<Input
							placeholder='0.00'
							type='number'
							size='large'
							value={amount}
							onChange={(e) => {
								setAmount(e.target.value);
							}}
						/>
						<Button
							className={style.amountDetailsMaxButton}
							type='link'
							size='small'
							onClick={() => {
								setAmount(BigIntToFloatString(stash.total, 18));
							}}
						>
							{intl.formatMessage({
								id: 'dashboard.bridge.max',
								defaultMessage: 'MAX',
							})}
						</Button>
					</div>
				</div>
			</div>
			<div className={style.downArrowSection}>
				<ArrowDownOutlined />
			</div>
			<div className={style.toLabel}>
				{intl.formatMessage({
					id: 'dashboard.bridge.to',
					defaultMessage: 'To',
				})}
			</div>
			<div className={style.toChainAndBalanceDetails}>
				<div className={style.chainDetails}>
					<Image
						src='/images/crypto/ethereum-eth-logo.svg'
						preview={false}
						className={style.chainIcon}
					/>
					<span className={style.chainDetailsChainName}>{ChainName}</span>
				</div>
				<div className={style.balanceDetails}>
					<span className={style.balanceDetailsLabel}>
						{intl.formatMessage({
							id: 'dashboard.bridge.balance',
							defaultMessage: 'Balance',
						})}:
					</span>
					<Tooltip placement="top" title={BigIntToFloatString(freeBalance, 18)}>
						<span className={style.balanceDetailsBalance}>
							<AD3 value={freeBalance} />
						</span>
					</Tooltip>
				</div>
			</div>
			<div className={style.downArrowSection}>
				<PlusOutlined />
			</div>
			<div className={style.destinationLabel}>
				{intl.formatMessage({
					id: 'dashboard.bridge.destinationAddress',
					defaultMessage: 'Destination Address',
				})}
			</div>
			<div className={style.destinationDetails}>
				<Input
					placeholder='0x......'
					type='text'
					size='large'
					value={destinationAddress}
					onChange={(e) => {
						setDestinationAddress(e.target.value);
					}}
				/>
				<Button
					className={style.destinationMyAddressButton}
					type='default'
					size='small'
					onClick={() => {
						setDestinationAddress(Account);
					}}
				>
					{intl.formatMessage({
						id: 'dashboard.bridge.me',
						defaultMessage: 'ME',
					})}
				</Button>
			</div>
			<Button
				block
				type='primary'
				size='large'
				shape='round'
				className={style.transferButton}
				onClick={() => {
					handleSubmit();
				}}
				disabled={!amount || !destinationAddress || FloatStringToBigInt(amount, 18) <= BigInt(0) || FloatStringToBigInt(amount, 18) > BigInt(freeBalance)}
			>
				{intl.formatMessage({
					id: 'dashboard.bridge.transfer',
					defaultMessage: 'Transfer',
				})}
			</Button>
		</>
	)
}

export default Withdraw;
