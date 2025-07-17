// Данные товара
export interface IProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
}

// Данные заказа
export interface IOrderDetails {
  paymentMethod: string;
  address: string;
  email: string;
  phone: string;
  items: IProduct[];
  totalPrice: number;
}

// Данные заказа, полученные Api
export interface IOrderResult {
    id: string;
}