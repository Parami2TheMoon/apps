import type {
    ethers,
    EventFilter,
    Signer,
    BigNumber,
    BigNumberish,
    PopulatedTransaction,
} from "ethers";
import type {
    ContractTransaction,
    Overrides,
    PayableOverrides,
    CallOverrides
} from "@ethersproject/contracts";
import {
    Contract
} from "@ethersproject/contracts";
import type { BytesLike } from "@ethersproject/bytes";
import type { Listener, Provider } from "@ethersproject/providers";
import type { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface WethInterface extends ethers.utils.Interface {
    functions: {
        "name()": FunctionFragment;
        "approve(address,uint256)": FunctionFragment;
        "totalSupply()": FunctionFragment;
        "transferFrom(address,address,uint256)": FunctionFragment;
        "withdraw(uint256)": FunctionFragment;
        "decimals()": FunctionFragment;
        "balanceOf(address)": FunctionFragment;
        "symbol()": FunctionFragment;
        "transfer(address,uint256)": FunctionFragment;
        "deposit()": FunctionFragment;
        "allowance(address,address)": FunctionFragment;
    };

    encodeFunctionData: (functionFragment: "name", values?: undefined) => string;
    encodeFunctionData: (
        functionFragment: "approve",
        values: [string, BigNumberish]
    ) => string;
    encodeFunctionData: (
        functionFragment: "totalSupply",
        values?: undefined
    ) => string;
    encodeFunctionData: (
        functionFragment: "transferFrom",
        values: [string, string, BigNumberish]
    ) => string;
    encodeFunctionData: (
        functionFragment: "withdraw",
        values: [BigNumberish]
    ) => string;
    encodeFunctionData: (functionFragment: "decimals", values?: undefined) => string;
    encodeFunctionData: (functionFragment: "balanceOf", values: [string]) => string;
    encodeFunctionData: (functionFragment: "symbol", values?: undefined) => string;
    encodeFunctionData: (
        functionFragment: "transfer",
        values: [string, BigNumberish]
    ) => string;
    encodeFunctionData: (functionFragment: "deposit", values?: undefined) => string;
    encodeFunctionData: (
        functionFragment: "allowance",
        values: [string, string]
    ) => string;

    decodeFunctionResult: (functionFragment: "name", data: BytesLike) => Result;
    decodeFunctionResult: (functionFragment: "approve", data: BytesLike) => Result;
    decodeFunctionResult: (
        functionFragment: "totalSupply",
        data: BytesLike
    ) => Result;
    decodeFunctionResult: (
        functionFragment: "transferFrom",
        data: BytesLike
    ) => Result;
    decodeFunctionResult: (functionFragment: "withdraw", data: BytesLike) => Result;
    decodeFunctionResult: (functionFragment: "decimals", data: BytesLike) => Result;
    decodeFunctionResult: (functionFragment: "balanceOf", data: BytesLike) => Result;
    decodeFunctionResult: (functionFragment: "symbol", data: BytesLike) => Result;
    decodeFunctionResult: (functionFragment: "transfer", data: BytesLike) => Result;
    decodeFunctionResult: (functionFragment: "deposit", data: BytesLike) => Result;
    decodeFunctionResult: (functionFragment: "allowance", data: BytesLike) => Result;

    events: {
        "Approval(address,address,uint256)": EventFragment;
        "Transfer(address,address,uint256)": EventFragment;
        "Deposit(address,uint256)": EventFragment;
        "Withdrawal(address,uint256)": EventFragment;
    };

    getEvent: (nameOrSignatureOrTopic: "Approval") => EventFragment;
    getEvent: (nameOrSignatureOrTopic: "Transfer") => EventFragment;
    getEvent: (nameOrSignatureOrTopic: "Deposit") => EventFragment;
    getEvent: (nameOrSignatureOrTopic: "Withdrawal") => EventFragment;
}

export class Weth extends Contract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    on(event: EventFilter | string, listener: Listener): this;
    once(event: EventFilter | string, listener: Listener): this;
    addListener(eventName: EventFilter | string, listener: Listener): this;
    removeAllListeners(eventName: EventFilter | string): this;
    removeListener(eventName: any, listener: Listener): this;

    interface: WethInterface;

    functions: {
        name: (
            overrides?: CallOverrides
        ) => Promise<{
            0: string;
        }>;

        "name()": (
            overrides?: CallOverrides
        ) => Promise<{
            0: string;
        }>;

        approve: (
            guy: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        "approve(address,uint256)": (
            guy: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        totalSupply: (
            overrides?: CallOverrides
        ) => Promise<{
            0: BigNumber;
        }>;

        "totalSupply()": (
            overrides?: CallOverrides
        ) => Promise<{
            0: BigNumber;
        }>;

        transferFrom: (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        "transferFrom(address,address,uint256)": (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        withdraw: (
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        "withdraw(uint256)": (
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        decimals: (
            overrides?: CallOverrides
        ) => Promise<{
            0: number;
        }>;

        "decimals()": (
            overrides?: CallOverrides
        ) => Promise<{
            0: number;
        }>;

        balanceOf: (
            arg0: string,
            overrides?: CallOverrides
        ) => Promise<{
            0: BigNumber;
        }>;

        "balanceOf(address)": (
            arg0: string,
            overrides?: CallOverrides
        ) => Promise<{
            0: BigNumber;
        }>;

        symbol: (
            overrides?: CallOverrides
        ) => Promise<{
            0: string;
        }>;

        "symbol()": (
            overrides?: CallOverrides
        ) => Promise<{
            0: string;
        }>;

        transfer: (
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        "transfer(address,uint256)": (
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<ContractTransaction>;

        deposit: (overrides?: PayableOverrides) => Promise<ContractTransaction>;

        "deposit()": (overrides?: PayableOverrides) => Promise<ContractTransaction>;

        allowance: (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<{
            0: BigNumber;
        }>;

        "allowance(address,address)": (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<{
            0: BigNumber;
        }>;
    };

    name: (overrides?: CallOverrides) => Promise<string>;

    "name()": (overrides?: CallOverrides) => Promise<string>;

    approve: (
        guy: string,
        wad: BigNumberish,
        overrides?: Overrides
    ) => Promise<ContractTransaction>;

    "approve(address,uint256)": (
        guy: string,
        wad: BigNumberish,
        overrides?: Overrides
    ) => Promise<ContractTransaction>;

    totalSupply: (overrides?: CallOverrides) => Promise<BigNumber>;

    "totalSupply()": (overrides?: CallOverrides) => Promise<BigNumber>;

    transferFrom: (
        src: string,
        dst: string,
        wad: BigNumberish,
        overrides?: Overrides
    ) => Promise<ContractTransaction>;

    "transferFrom(address,address,uint256)": (
        src: string,
        dst: string,
        wad: BigNumberish,
        overrides?: Overrides
    ) => Promise<ContractTransaction>;

    withdraw: (
        wad: BigNumberish,
        overrides?: Overrides
    ) => Promise<ContractTransaction>;

    "withdraw(uint256)": (
        wad: BigNumberish,
        overrides?: Overrides
    ) => Promise<ContractTransaction>;

    decimals: (overrides?: CallOverrides) => Promise<number>;

    "decimals()": (overrides?: CallOverrides) => Promise<number>;

    balanceOf: (arg0: string, overrides?: CallOverrides) => Promise<BigNumber>;

    "balanceOf(address)": (
        arg0: string,
        overrides?: CallOverrides
    ) => Promise<BigNumber>;

    symbol: (overrides?: CallOverrides) => Promise<string>;

    "symbol()": (overrides?: CallOverrides) => Promise<string>;

    transfer: (
        dst: string,
        wad: BigNumberish,
        overrides?: Overrides
    ) => Promise<ContractTransaction>;

    "transfer(address,uint256)"(
        dst: string,
        wad: BigNumberish,
        overrides?: Overrides
    ): Promise<ContractTransaction>;

    deposit(overrides?: PayableOverrides): Promise<ContractTransaction>;

    "deposit()"(overrides?: PayableOverrides): Promise<ContractTransaction>;

    allowance: (
        arg0: string,
        arg1: string,
        overrides?: CallOverrides
    ) => Promise<BigNumber>;

    "allowance(address,address)"(
        arg0: string,
        arg1: string,
        overrides?: CallOverrides
    ): Promise<BigNumber>;

    callStatic: {
        name: (overrides?: CallOverrides) => Promise<string>;

        "name()": (overrides?: CallOverrides) => Promise<string>;

        approve: (
            guy: string,
            wad: BigNumberish,
            overrides?: CallOverrides
        ) => Promise<boolean>;

        "approve(address,uint256)": (
            guy: string,
            wad: BigNumberish,
            overrides?: CallOverrides
        ) => Promise<boolean>;

        totalSupply: (overrides?: CallOverrides) => Promise<BigNumber>;

        "totalSupply()": (overrides?: CallOverrides) => Promise<BigNumber>;

        transferFrom: (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: CallOverrides
        ) => Promise<boolean>;

        "transferFrom(address,address,uint256)": (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: CallOverrides
        ) => Promise<boolean>;

        withdraw: (wad: BigNumberish, overrides?: CallOverrides) => Promise<void>;

        "withdraw(uint256)": (
            wad: BigNumberish,
            overrides?: CallOverrides
        ) => Promise<void>;

        decimals: (overrides?: CallOverrides) => Promise<number>;

        "decimals()": (overrides?: CallOverrides) => Promise<number>;

        balanceOf: (arg0: string, overrides?: CallOverrides) => Promise<BigNumber>;

        "balanceOf(address)": (
            arg0: string,
            overrides?: CallOverrides
        ) => Promise<BigNumber>;

        symbol: (overrides?: CallOverrides) => Promise<string>;

        "symbol()": (overrides?: CallOverrides) => Promise<string>;

        transfer: (
            dst: string,
            wad: BigNumberish,
            overrides?: CallOverrides
        ) => Promise<boolean>;

        "transfer(address,uint256)": (
            dst: string,
            wad: BigNumberish,
            overrides?: CallOverrides
        ) => Promise<boolean>;

        deposit: (overrides?: CallOverrides) => Promise<void>;

        "deposit()": (overrides?: CallOverrides) => Promise<void>;

        allowance: (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<BigNumber>;

        "allowance(address,address)": (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<BigNumber>;
    };

    filters: {
        Approval: (src: string | null, guy: string | null, wad: null) => EventFilter;

        Transfer: (src: string | null, dst: string | null, wad: null) => EventFilter;

        Deposit: (dst: string | null, wad: null) => EventFilter;

        Withdrawal: (src: string | null, wad: null) => EventFilter;
    };

    estimateGas: {
        name: (overrides?: CallOverrides) => Promise<BigNumber>;

        "name()": (overrides?: CallOverrides) => Promise<BigNumber>;

        approve: (
            guy: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<BigNumber>;

        "approve(address,uint256)": (
            guy: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<BigNumber>;

        totalSupply: (overrides?: CallOverrides) => Promise<BigNumber>;

        "totalSupply()": (overrides?: CallOverrides) => Promise<BigNumber>;

        transferFrom: (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<BigNumber>;

        "transferFrom(address,address,uint256)": (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<BigNumber>;

        withdraw: (wad: BigNumberish, overrides?: Overrides) => Promise<BigNumber>;

        "withdraw(uint256)": (
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<BigNumber>;

        decimals: (overrides?: CallOverrides) => Promise<BigNumber>;

        "decimals()": (overrides?: CallOverrides) => Promise<BigNumber>;

        balanceOf: (arg0: string, overrides?: CallOverrides) => Promise<BigNumber>;

        "balanceOf(address)": (
            arg0: string,
            overrides?: CallOverrides
        ) => Promise<BigNumber>;

        symbol: (overrides?: CallOverrides) => Promise<BigNumber>;

        "symbol()": (overrides?: CallOverrides) => Promise<BigNumber>;

        transfer: (
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<BigNumber>;

        "transfer(address,uint256)": (
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<BigNumber>;

        deposit: (overrides?: PayableOverrides) => Promise<BigNumber>;

        "deposit()": (overrides?: PayableOverrides) => Promise<BigNumber>;

        allowance: (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<BigNumber>;

        "allowance(address,address)": (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<BigNumber>;
    };

    populateTransaction: {
        name: (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        "name()": (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        approve: (
            guy: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        "approve(address,uint256)": (
            guy: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        totalSupply: (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        "totalSupply()": (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        transferFrom: (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        "transferFrom(address,address,uint256)": (
            src: string,
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        withdraw: (
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        "withdraw(uint256)": (
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        decimals: (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        "decimals()": (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        balanceOf: (
            arg0: string,
            overrides?: CallOverrides
        ) => Promise<PopulatedTransaction>;

        "balanceOf(address)": (
            arg0: string,
            overrides?: CallOverrides
        ) => Promise<PopulatedTransaction>;

        symbol: (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        "symbol()": (overrides?: CallOverrides) => Promise<PopulatedTransaction>;

        transfer: (
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        "transfer(address,uint256)": (
            dst: string,
            wad: BigNumberish,
            overrides?: Overrides
        ) => Promise<PopulatedTransaction>;

        deposit: (overrides?: PayableOverrides) => Promise<PopulatedTransaction>;

        "deposit()": (overrides?: PayableOverrides) => Promise<PopulatedTransaction>;

        allowance: (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<PopulatedTransaction>;

        "allowance(address,address)": (
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ) => Promise<PopulatedTransaction>;
    };
}
