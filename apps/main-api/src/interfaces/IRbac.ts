import { IBase } from './IBase';

export interface IRole extends IBase {
  name: string;
  description: string;
  parentId: number;
}

export interface IPermission extends IBase {
  title: string;
  description: string;
  module: string;
}
