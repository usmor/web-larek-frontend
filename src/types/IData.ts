// Данные товара
export interface IProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
}

// Данные заказа
export interface IOrderDetails {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

// Данные заказа, полученные Api
export interface IOrderResult {
    id: string;
}