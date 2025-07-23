import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { IOrderDetails, IProduct } from './types/IData';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { CatalogItem, CardPreview, BasketItem } from './components/view/Card';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { Basket } from './components/view/Basket';
import { OrderFormView, ContactsFormView } from './components/view/Order';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import {
	IBasketItem,
	ICardPreview,
	ICatalogItem,
	OrderFormData,
	ContactsFormData,
} from './types/IView';
import { Success } from './components/view/Success';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Модели данных
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// Темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderFormView(cloneTemplate(orderTemplate), events);
const contacts = new ContactsFormView(cloneTemplate(contactsTemplate), events);
let currentModal: 'order' | 'contacts' | null = null;

// Изменение каталога
events.on('catalog:changed', () => {
	page.catalog = catalogModel.items.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			category: item.category,
			price: item.price,
			image: item.image,
		} as ICatalogItem);
	});

	page.counter = basketModel.totalProductNumber;
});

// Добавление товара
events.on('card:add', (item: IProduct) => {
	basketModel.add(item.id);
});

// Удаление товара
events.on('card:remove', (item: IProduct) => {
	basketModel.remove(item.id);
});

// Изменение корзины
events.on('basket:changed', () => {
	const items = basketModel.items;
	const productList = items
		.map((id) => catalogModel.getProduct(id))
		.filter((product): product is IProduct => !!product);

	page.counter = productList.length;
	basketModel.totalPrice = productList.reduce(
		(acc, item) => acc + (item.price || 0),
		0
	);
	basket.total = basketModel.totalPrice;

	basket.items = productList.map((product, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', product),
		});

		return card.render({
			id: product.id,
			title: product.title,
			price: product.price,
			index: index + 1,
		} as IBasketItem);
	});
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

// Закрытие корзины
events.on('basket:close', () => {
	modal.close();
});

events.on('order:submit', () => {
	const total = orderModel.order.total;

	api
		.orderProducts(orderModel.getOrder())
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: total,
				}),
			});

			basketModel.clear();
			orderModel.clear();
			events.emit('basket:changed');
		})
		.catch((err) => {
			console.error('Ошибка оформления заказа:', err);
		});
});

// Открытие превью
events.on('card:select', (item: IProduct) => {
	catalogModel.setPreview(item.id);
});

events.on('preview:changed', () => {
	const id = catalogModel.preview;
	const item = id ? catalogModel.getProduct(id) : null;

	const showItem = (item: IProduct) => {
		const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				const isInBasket = basketModel.items.includes(item.id);

				if (!isInBasket) {
					events.emit('card:add', item);
					card.setButtonText('Удалить из корзины');
				} else {
					events.emit('card:remove', item);
					card.setButtonText('В корзину');
				}
			},
		});

		if (basketModel.items.includes(item.id)) {
			card.setButtonText('Удалить из корзины');
		} else {
			card.setButtonText('В корзину');
		}

		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				category: item.category,
			} as ICardPreview),
		});
	};

	if (item) {
		api
			.getProductItem(item.id)
			.then((result) => {
				item.description = result.description;
				item.title = result.title;
				item.image = result.image;
				item.price = result.price;
				item.category = result.category;
				showItem(item);
			})
			.catch((err) => {
				console.error('Ошибка при получении карточки:', err);
			});
	} else {
		modal.close();
	}
});

events.on('form:order:open', () => {
	orderModel.updateBasketData(basketModel.items, basketModel.totalPrice);
	currentModal = 'order';
	orderModel.validate();
	modal.render({
		content: order.render({
			payment: orderModel.order.payment as 'card' | 'cash',
			address: orderModel.order.address,
			valid: orderModel.validate(),
			errors: Object.values(orderModel.formErrors).filter((i) => !!i),
		}),
	});
});

events.on('form:contacts:open', () => {
	currentModal = 'contacts';
	orderModel.validate();
	modal.render({
		content: contacts.render({
			phone: orderModel.order.phone,
			email: orderModel.order.email,
			valid: orderModel.validate(),
			errors: Object.values(orderModel.formErrors).filter((i) => !!i),
		}),
	});
});

// Закрытие формы заказа
events.on('form:order:close', () => {
	orderModel.clear();
	order.reset();
});

// Закрытие формы контактов
events.on('form:contacts:close', () => {
	orderModel.clear();
	contacts.reset();
});

// Валидация форм
events.on('order:errors', (errors: Partial<IOrderDetails>) => {
	const orderErrors = {
		address: errors.address,
		payment: errors.payment,
	};

	const contactsErrors = {
		email: errors.email,
		phone: errors.phone,
	};

	order.valid = !orderErrors.address && !orderErrors.payment;
	order.errors = Object.values(orderErrors).filter((i) => !!i);

	contacts.valid = !contactsErrors.email && !contactsErrors.phone;
	contacts.errors = Object.values(contactsErrors).filter((i) => !!i);
});

// Обработка изменения полей формы заказа (address, payment)
events.on(
	/^form:order\.(.*):change$/,
	(data: { field: keyof OrderFormData; value: string }) => {
		orderModel.updateOrderField(data.field, data.value);
	}
);

// Обработка изменения полей формы контактов (email, phone)
events.on(
	/^form:contacts\.(.*):change$/,
	(data: { field: keyof ContactsFormData; value: string }) => {
		orderModel.updateOrderField(data.field, data.value);
	}
);

// Блокировка прокрутки страницы, если модальное окно открыто
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокировка прокрутки страницы, если модальное окно закрыто
events.on('modal:close', () => {
	page.locked = false;
	if (currentModal === 'order') {
		events.emit('form:order:close');
	} else if (currentModal === 'contacts') {
		events.emit('form:contacts:close');
	}

	currentModal = null;
});

// Получение каталога с сервера
api.getProductsList().then((products: IProduct[]) => {
	catalogModel.items = products;
});
