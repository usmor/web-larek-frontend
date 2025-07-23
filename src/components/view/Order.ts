import { Form } from './Form';
import { OrderFormData, ContactsFormData } from '../../types/IView';
import { IEvents } from '../base/events';

export class OrderFormView extends Form<OrderFormData> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _selectedPayment: 'card' | 'cash' | null = null;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentButtons = Array.from(
			container.querySelectorAll('.button_alt')
		) as HTMLButtonElement[];

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name as 'card' | 'cash';
			});
		});

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit('form:contacts:open');
        });
	}

	set payment(value: 'card' | 'cash') {
		this._selectedPayment = value;

		this._paymentButtons.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === value);
		});

		this.events.emit(`form:order.payment:change`, {
			field: 'payment',
			value: value,
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

    reset() {
		this.address = '';
		this.payment = null;
		this.valid = false;
		this.errors = [];
		this._paymentButtons.forEach((button) => {
			button.classList.remove('button_alt-active');
		});
	}
}

export class ContactsFormView extends Form<ContactsFormData> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit('order:submit');
        });
        
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

    reset() {
		this.phone = '';
		this.email = '';
		this.valid = false;
		this.errors = [];
	}
}
