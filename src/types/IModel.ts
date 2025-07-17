import { IProduct, IOrderDetails } from "./IData";

// Каталог товаров
export interface ICatalogModel {
  items: IProduct[];                              // список товаров
  preview: string | null;                         // id карточки, выбранной для просмотра в модальном окне
  getProduct(id: string): IProduct | undefined;   // получить при рендере списков
  setPreview(id: string | null): void;            // установить выбранный товар
}

// Корзина
export interface IBasketModel {
  items: Map<string, number>;       // товары в корзине
  totalPrice: number;               // итоговая цена
  totalProductNumber: number;       // количество товаров
  add(id: string): void;            // добавить товар в корзину
  remove(id: string): void;         // удалить товар из корзины
  clear(): void;
}

// Заказ
export interface IOrderModel {
  order: IOrderDetails;                                               // данные заказа
  formErrors: Partial<Record<keyof IOrderDetails, string>>;           // ошибки формы
  updateOrderField(field: keyof IOrderDetails, value: string): void;  // обновить поле
  validate(): boolean;                                                // проверить заполненность
  getOrder(): IOrderDetails;                                          // получить заказ (если валиден)
  clear(): void;
}