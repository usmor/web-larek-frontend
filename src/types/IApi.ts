import { IProduct, IOrderDetails, IOrderResult } from "./IData";

export interface IAppAPI {
    getProductsList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrderDetails) => Promise<IOrderResult>;
}