import {UserInfo} from "@uauth/js";

export type User = UserInfo | undefined;

export type Holding = {
  address: string;
  name: string;
  symbol: string;
  balance: number;
  image: string;
  rate: number;
  value: number;
  diff: any;
  diff7d: any;
  diff30d: any;
};

interface IObjectKeys {
  [key: string]: number;
}

export interface Diffs extends IObjectKeys {
  diff: number;
  diff7d: number;
  diff30d: number;
}
