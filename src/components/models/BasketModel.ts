import { IProduct } from "../../types/IData";
import { IBasketModel } from "../../types/IModel";
import { IEvents } from "../base/events";

export class BasketModel implements IBasketModel {
  protected _items: string[] = [];
  protected _totalPrice: number = 0;
  protected _totalProductNumber: number = 0; 
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  get items(): string[] {
    return this._items;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get totalProductNumber(): number {
    return this._totalProductNumber;
  }

  set totalProductNumber(value: number) {
    this._totalProductNumber = value;
  }

  set totalPrice(value: number) {
    this._totalPrice= value;
  }

  add(id: string): void {
    if(!this._items.includes(id)) {
      this._items.push(id);
      this.events.emit('basket:changed', this._items);
    }
  }

  remove(id: string): void {
    if(this._items.includes(id)) {
      this._items = this._items.filter((item) => item !== id);
      this.events.emit('basket:changed', this._items);
    }
  }

  clear(): void {
    this._items = []
    this._totalPrice = 0;
    this._totalProductNumber = 0;
    this.events.emit('basket:changed', this._items);
  }
}