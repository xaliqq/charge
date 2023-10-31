import { selectOption } from './common';


export interface ITerminalGroupItem {
  id: number,
  value: string,
  isMain: boolean,
  label: string,
}

interface IBranchShared {
  readonly id: number;
  readonly externalId: string;
  readonly externalName: string;
  readonly externalCode: string;
  readonly externalAddress: string;
  readonly longitude: number;
  readonly latitude: number;
  isActive: boolean,
  internalNameAz: null | string;
  internalNameEn: null | string;
  internalNameRu: null | string;
  internalAddressAz: null | string;
  internalAddressEn: null | string;
  internalAddressRu: null | string;
  imageUrl: null | string;
  phoneNumber: null | string;
  openingHour: null | string | selectOption;
  closingHour: null | string | selectOption;
  terminalGroups: null | ITerminalGroupItem[]
}
interface IBranchItem extends IBranchShared {
  terminalGroups: ITerminalGroupItem[] | []
}
interface IBranchItemPayload extends IBranchShared {
  terminalGroup: null | ITerminalGroupItem
}

interface IBranchSelect {
  id:number;
  name:string
}

export type { IBranchItem, IBranchItemPayload,IBranchSelect };
