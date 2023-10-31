interface IConnectorsItem {
  type: string;
}
interface IChargePointsItem {
  id: string;
  externalId: string;
  name: string;
  status: string;
  type: string;
  lastUpdated: string;
  createdAt: string;
  maxVoltage: number;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  isActive: boolean;
  connectors?: IConnectorsItem[];
  owner?: string;
}
interface IChargePointDetailItem {
  data: {
    id: string;
    externalId: string;
    name: string;
    status: string;
    type: string;
    lastUpdated: string;
    createdAt: string;
    maxVoltage: number;
    latitude: number;
    longitude: number;
    pricePerHour: number;
    isActive: boolean;
  };
}
export type { IChargePointsItem, IChargePointDetailItem };
