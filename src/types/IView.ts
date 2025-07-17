// карточка (общее)
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  title: string;
  price: number;
}

//  каталог
export interface ICatalogItem extends ICard{
  image: string;
  category: string;
}

// превью
export interface ICardPreview extends ICard {
  description: string;
  image: string;
  category: string;
}

// модальное окно 
export interface IModalData {
    content: HTMLElement;
}

// корзина
export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

// форма
export interface IFormState {
    valid: boolean;
    errors: string[];
}

// форма заказа
export type OrderFormData = {
  address: string;
  payment: 'card' | 'cash';
};

// форма контактов
export type ContactsFormData = {
  phone: string;
  email: string;
};

// успешный заказ
export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

// страница целиком
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}