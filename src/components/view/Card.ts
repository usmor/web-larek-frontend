import { Component } from './Component';
import {
	ICard,
	ICardActions,
	ICardPreview,
	ICatalogItem, 
	IBasketItem
} from '../../types/IView';
import { bem, ensureElement } from '../../utils/utils';
import clsx from 'clsx';

export class Card extends Component<ICard> implements ICard {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}
}

export class CatalogItem extends Card implements ICatalogItem {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		const categoryModifierMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			'дополнительное': 'additional',
			'кнопка': 'button'
		};

  	const modifier = categoryModifierMap[value] || 'other';

  	this._category.className = clsx(
    	'card__category',
    	bem(this.blockName, 'category', modifier).name
  	);	
	}

}

export class CardPreview extends Card implements ICardPreview {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
	}

	set category(value: string) {
		this.setText(this._category, value);
		const categoryModifierMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			'дополнительное': 'additional',
			'кнопка': 'button'
		};

  	const modifier = categoryModifierMap[value] || 'other';

  	this._category.className = clsx(
    	'card__category',
    	bem(this.blockName, 'category', modifier).name
  	);	
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this.container.querySelector('button'), true);
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.setDisabled(this.container.querySelector('button'), false);
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	setButtonText(value: string): void {
		this._button.textContent = value;
	}
}

export class BasketItem extends Card implements IBasketItem{
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		}

	set index(value: number) {
		this.setText(this._index, value);
	}
}
