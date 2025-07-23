import { IProduct } from "../../types/IData";
import { ICatalogModel } from "../../types/IModel";
import { IEvents } from "../base/events";

export class CatalogModel implements ICatalogModel {
  protected _items: IProduct[] = [];
  public preview: string | null = null;
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  set items(items: IProduct[]) {
    this._items = items;
    this.events.emit('catalog:changed', this._items);
  }

  get items(): IProduct[] {
    return this._items;
  }

  getProduct(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setPreview(id: string | null): void {
    this.preview = id;
    this.events.emit('preview:changed');
  }
}