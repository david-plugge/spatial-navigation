import { ATTRIBUTES } from './constants';
import { getAttributeBoolean } from './utils';

export class SelectableItem {
	private readonly _element: HTMLElement;
	readonly type = 'item';

	constructor(element: HTMLElement) {
		this._element = element;
	}

	get element() {
		return this._element;
	}

	get disabled() {
		return getAttributeBoolean(this.element, ATTRIBUTES.disabled, false);
	}
	get initial() {
		return getAttributeBoolean(this.element, ATTRIBUTES.initial, false);
	}

	get group() {
		const groupElement =
			this.element.parentElement?.closest<HTMLElement>(
				`[${ATTRIBUTES.group}]`,
			) || document.body;
		return new SelectableGroup(groupElement);
	}

	select() {
		document
			.querySelectorAll(`[${ATTRIBUTES.selected}]`)
			.forEach((el) => el.removeAttribute(ATTRIBUTES.selected));
		this.element.setAttribute(ATTRIBUTES.selected, '');
	}

	static is(element: HTMLElement) {
		return element.hasAttribute(ATTRIBUTES.item);
	}
}

export class SelectableGroup {
	private readonly _element: HTMLElement;
	readonly type = 'group';

	constructor(element: HTMLElement) {
		this._element = element;
	}

	get element() {
		return this._element;
	}

	get group() {
		const groupElement =
			this.element.parentElement?.closest<HTMLElement>(
				`[${ATTRIBUTES.group}]`,
			) || document.body;
		return new SelectableGroup(groupElement);
	}

	get disabled() {
		return getAttributeBoolean(this.element, ATTRIBUTES.disabled, false);
	}
	get initial() {
		return getAttributeBoolean(this.element, ATTRIBUTES.initial, false);
	}
	get isolated() {
		return getAttributeBoolean(this.element, ATTRIBUTES.isolated, false);
	}
	get saveLast() {
		return getAttributeBoolean(this.element, ATTRIBUTES.saveLast, true);
	}

	get selectables() {
		const items: (SelectableGroup | SelectableItem)[] = [];

		const walker = document.createTreeWalker(
			this._element,
			NodeFilter.SHOW_ELEMENT,
			{
				acceptNode(node: HTMLElement) {
					if (SelectableGroup.is(node)) {
						items.push(new SelectableGroup(node));
						return NodeFilter.FILTER_REJECT;
					} else if (SelectableItem.is(node)) {
						items.push(new SelectableItem(node));
						return NodeFilter.FILTER_REJECT;
					}
					return NodeFilter.FILTER_ACCEPT;
				},
			},
		);
		while (walker.nextNode());

		return items;
	}

	select() {
		const items = this.selectables;

		if (items.length === 0) return;

		const initial = items.find((item) => item.initial);
		if (initial) {
			initial.select();
		} else {
			items[0].select();
		}
	}

	static is(element: HTMLElement) {
		return (
			element.hasAttribute(ATTRIBUTES.group) ||
			element.isSameNode(document.body)
		);
	}
}

export function isDisabled(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.disabled, false);
}
