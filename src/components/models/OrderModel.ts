import { IOrderDetails } from "../../types/IData";
import { IOrderModel } from "../../types/IModel";
import { IEvents } from "../base/events";

export class OrderModel implements IOrderModel {
  protected _order: IOrderDetails = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    items: [],
    total: 0
  };
  protected _formErrors: Partial<Record<keyof IOrderDetails, string>> = {}; 
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  get order(): IOrderDetails {
    return this._order;
  }

  get formErrors(): Partial<Record<keyof IOrderDetails, string>> {
    return this._formErrors;
  }

  getOrder(): IOrderDetails {
    if (this.validate()) {
      return this._order;
    }
    throw new Error('Нельзя оформить заказ: есть ошибки в данных');
  }
  
  updateOrderField(field: keyof IOrderDetails, value: string): void {
    if (field === 'items' || field === 'total') {
      return;
    }
    this._order[field] = value;
    this.validate();
    this.events.emit('order:changed', { field, value });
  }

  updateBasketData(items: string[], total: number): void {
    this._order.items = items;
    this._order.total = total;
    this.events.emit('order:changed', { 
      items: this._order.items,
      total: this._order.total
    });
  }

  validate() {
        const errors: typeof this._formErrors = {};
        if (!this._order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this._order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this._order.address) {
          errors.address = 'Необходимо указать адрес';
        }
        if (!this._order.payment) {
          errors.payment = 'Необходимо указать способ оплаты';
        }

        this._formErrors = errors;
        this.events.emit('order:errors', this._formErrors);
        return Object.keys(errors).length === 0;
    }

  clear(): void {
    this._order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
      items: [],
      total: 0
    };
    this._formErrors = {};
    this.events.emit('order:changed', this._order);
    this.events.emit('order:errors', this._formErrors);
  }
}